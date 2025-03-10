import { v } from "convex/values";
import Stripe from "stripe";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action, internalAction } from "./_generated/server";
import { checkIfProductCanBePurchased } from "./actionHelpers";

export const createCheckoutSession = action({
  args: {
    productId: v.id("products"),
    userId: v.id("users"),
  },
  handler: async (
    ctx,
    { productId, userId }
  ): Promise<{
    sessionUrl: string;
    sessionId: string;
  }> => {
    const { product } = await checkIfProductCanBePurchased(
      ctx,
      productId,
      userId
    );

    const domain = process.env.HOSTING_URL ?? "http://localhost:3000";
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });

    const purchaseId = await ctx.runMutation(internal.purchases.createPending, {
      userId,
      productId,
      paymentMethod: "stripe",
    });

    const formattedName = product.name;
    const currency = product.currency.toLowerCase();

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: currency,
            unit_amount: product.priceInCents,
            product_data: {
              name: formattedName,
              description: product.description,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${domain}/checkout/success?purchaseId=${purchaseId}`,
      cancel_url: `${domain}/checkout/cancel?purchaseId=${purchaseId}`,
      client_reference_id: purchaseId,
      metadata: {
        purchaseId: purchaseId,
        productId: productId,
        userId: userId,
      },
    });

    if (!session.url || !session.id) {
      throw new Error(
        "Error creating checkout session - can't get session url"
      );
    }

    await ctx.runMutation(internal.purchases.updatePaymentIntent, {
      purchaseId,
      paymentIntentId: session.id,
    });

    return {
      sessionUrl: session.url,
      sessionId: session.id,
    };
  },
});

/**
 * Process a Stripe webhook event
 */
export const fulfill = internalAction({
  args: {
    signature: v.string(),
    payload: v.string(),
  },
  handler: async ({ runMutation, runQuery }, { signature, payload }) => {
    const stripe = new Stripe(process.env.STRIPE_KEY!, {
      apiVersion: "2025-02-24.acacia",
    });

    const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET as string;
    try {
      // Verify the webhook signature
      const event = await stripe.webhooks.constructEventAsync(
        payload,
        signature,
        webhookSecret
      );

      // Handle different event types
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const purchaseId = session.client_reference_id as Id<"purchases">;

        // Mark the purchase as completed
        await runMutation(internal.purchases.markCompleted, {
          purchaseId,
        });

        // If this is a credit purchase, add credits to the user's account
        const purchase = await runQuery(internal.purchases.get, {
          id: purchaseId,
        });
        if (purchase) {
          const product = await runQuery(internal.products.get, {
            id: purchase.productId,
          });
          if (
            product &&
            product.type === "credit" &&
            product.metadata?.creditAmount
          ) {
            await runMutation(internal.credits.add, {
              userId: purchase.userId,
              amount: product.metadata.creditAmount,
            });
          }
        }
      } else if (event.type === "charge.refunded") {
        // Handle refund events
        const charge = event.data.object as Stripe.Charge;
        const session = await stripe.checkout.sessions.list({
          payment_intent: charge.payment_intent as string,
        });

        if (session.data.length > 0) {
          const purchaseId = session.data[0]
            .client_reference_id as Id<"purchases">;

          // Mark the purchase as refunded
          await runMutation(internal.purchases.markRefunded, {
            purchaseId,
          });

          // If this was a credit purchase, remove the credits
          const purchase = await runQuery(internal.purchases.get, {
            id: purchaseId,
          });
          if (purchase) {
            const product = await runQuery(internal.products.get, {
              id: purchase.productId,
            });
            if (
              product &&
              product.type === "credit" &&
              product.metadata?.creditAmount
            ) {
              await runMutation(internal.credits.remove, {
                userId: purchase.userId,
                amount: product.metadata.creditAmount,
              });
            }
          }
        }
      }

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: (err as { message: string }).message };
    }
  },
});
