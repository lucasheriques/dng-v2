import { v } from "convex/values";
import {
  createAbacatePixPayment,
  type AbacatePayWebhookPayload,
} from "../lib/abacatepay";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action, internalAction } from "./_generated/server";
import { checkIfProductCanBePurchased } from "./actionHelpers";

export const createPixPayment = action({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const abacateApiKey = process.env.ABACATE_API_KEY;
    if (!abacateApiKey) {
      throw new Error("ABACATE_API_KEY environment variable is not set.");
    }
    const siteUrl = process.env.SITE_URL;
    if (!siteUrl) {
      throw new Error("SITE_URL environment variable is not set.");
    }

    const { product, user } = await checkIfProductCanBePurchased(
      ctx,
      args.productId,
      args.userId
    );

    if (!user.email || !user.name) {
      // Consider adding more specific checks or default values if applicable
      throw new Error("User data (name or email) is missing for payment.");
    }

    // Create a pending purchase record
    const purchaseId = await ctx.runMutation(internal.purchases.createPending, {
      userId: args.userId,
      productId: args.productId,
      paymentMethod: "pix",
    });

    try {
      const { paymentIntentId, paymentUrl } = await createAbacatePixPayment({
        apiKey: abacateApiKey,
        products: [
          {
            externalId: purchaseId,
            name: product.name,
            description: product.description,
            quantity: 1,
            price: product.pixPriceInCents,
          },
        ],
        returnUrl: `${siteUrl}/${product.slug}?purchaseId=${purchaseId}`,
        completionUrl: `${siteUrl}/checkout/success?purchaseId=${purchaseId}`,
        customer: {
          name: user.name,
          cellphone: user.phone, // Ensure user.phone exists or handle undefined
          email: user.email,
          taxId: user.cpf, // Ensure user.cpf exists or handle undefined
        },
      });

      // Update the purchase with the payment intent ID
      await ctx.runMutation(internal.purchases.updatePaymentIntent, {
        purchaseId,
        paymentIntentId,
      });

      return paymentUrl;
    } catch (error) {
      console.error("Failed to create AbacatePay PIX payment:", error);
      // Optionally, revert the pending purchase or mark it as failed
      // await ctx.runMutation(internal.purchases.markAsFailed, { purchaseId });
      throw new Error(
        `Failed to initiate PIX payment: ${(error as Error).message}`
      );
    }
  },
});

export const fulfill = internalAction({
  args: {
    payload: v.string(), // Raw JSON string from the webhook
  },
  handler: async ({ runMutation, runQuery }, { payload }) => {
    try {
      // Type assertion after parsing
      const webhookData = JSON.parse(payload) as AbacatePayWebhookPayload;

      // Verify event type
      if (webhookData.event !== "billing.paid") {
        console.log(`Ignoring webhook event: ${webhookData.event}`);
        return { success: true };
      }

      // Validate essential data exists
      if (!webhookData.data?.billing?.products) {
        console.error(
          "Invalid webhook payload: Missing billing or product data."
        );
        // Return success to prevent retries for fundamentally invalid data
        return { success: true, error: "Invalid payload structure" };
      }

      const { billing } = webhookData.data;

      // Check if status is PAID
      if (billing.status !== "PAID") {
        console.log(`Ignoring non-PAID billing status: ${billing.status}`);
        return { success: true };
      }

      let allProductsProcessed = true;

      // Process each product in the billing
      for (const product of billing.products) {
        // Explicitly cast externalId to Id<"purchases">
        const purchaseId = product.externalId as Id<"purchases">;

        try {
          // Fetch the purchase record using the externalId
          const purchase = await runQuery(internal.purchases.get, {
            id: purchaseId,
          });

          if (!purchase) {
            console.error(
              `No purchase found for externalId (purchaseId): ${purchaseId}`
            );
            allProductsProcessed = false;
            continue; // Move to the next product
          }

          // Avoid reprocessing already completed purchases
          if (purchase.status === "completed") {
            console.log(`Purchase ${purchaseId} already completed. Skipping.`);
            continue;
          }

          // Mark the purchase as completed
          await runMutation(internal.purchases.markCompleted, {
            purchaseId: purchase._id,
          });
          console.log(`Purchase ${purchaseId} marked as completed.`);

          // Handle credits if applicable
          const productDetails = await runQuery(internal.products.get, {
            id: purchase.productId,
          });

          if (
            productDetails &&
            productDetails.type === "credit" &&
            productDetails.metadata?.creditAmount
          ) {
            await runMutation(internal.credits.add, {
              userId: purchase.userId,
              amount: productDetails.metadata.creditAmount,
            });
            console.log(
              `Added ${productDetails.metadata.creditAmount} credits to user ${purchase.userId}.`
            );
          }
        } catch (productErr) {
          console.error(
            `Error processing product with externalId ${purchaseId}:`,
            productErr
          );
          allProductsProcessed = false;
          // Decide if you want to continue processing other products or stop
        }
      }

      // Return success based on whether all products were processed without error
      return { success: allProductsProcessed };
    } catch (err) {
      console.error("Error processing PIX webhook payload:", err);
      // Return failure for errors during parsing or initial validation
      return { success: false, error: (err as Error).message };
    }
  },
});
