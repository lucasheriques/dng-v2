import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { action, internalAction } from "./_generated/server";
import { checkIfProductCanBePurchased } from "./actionHelpers";

interface PixWebhookResponse {
  data: {
    billing: {
      amount: number;
      couponsUsed: string[];
      customer: {
        id: string;
        metadata: {
          cellphone: string;
          email: string;
          name: string;
          taxId: string;
        };
      };
      frequency: "ONE_TIME";
      id: string;
      kind: ["PIX"];
      paidAmount: number;
      products: {
        externalId: string;
        id: string;
        quantity: number;
      }[];
      status: "PAID";
    };
    payment: {
      amount: number;
      fee: number;
      method: "PIX";
    };
  };
  devMode: boolean;
  event: "billing.paid";
}

const API_URL = "https://api.abacatepay.com/v1";

const endpoints = {
  createPayment: `${API_URL}/billing/create`,
};

interface Product {
  externalId: Id<"purchases">;
  name: string;
  description: string;
  quantity: number; // >=1
  price: number; // in cents, minimum 100 (1 BRL)
}

interface Customer {
  name: string;
  cellphone?: string;
  email: string;
  taxId?: string; // CPF or CNPJ
}

interface CreatePaymentBody {
  frequency: "ONE_TIME";
  methods: ["PIX"];
  products: Product[]; // >=1
  returnUrl: string; // has to be a valid url. URL to redirect if they click "Back" on the browser
  completionUrl: string; // has to be a valid url. URL to redirect after the payment is completed
  customerId?: string; // if customer is created
  customer?: Customer; // if customer is not created
}

interface CreatePaymentSucessfulResponse {
  data: {
    id: string;
    url: string;
    amount: number;
    status: "PENDING" | "EXPIRED" | "CANCELLED" | "PAID" | "REFUNDED";
    devMode: boolean;
    methods: string[];
    products: {
      id: string;
      externalId: string;
      quantity: number;
    }[];
    frequency: string;
    nextBilling: string | null;
    customer: {
      id: string;
      metadata: Customer;
    } | null;
  };
  error: null;
}

interface CreatePaymentErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  code: string;
}

type CreatePaymentResponse =
  | CreatePaymentSucessfulResponse
  | CreatePaymentErrorResponse;

export const createPixPayment = action({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const { product, user } = await checkIfProductCanBePurchased(
      ctx,
      args.productId,
      args.userId
    );

    if (!user.email || !user.name) {
      throw new Error("User data is missing");
    }

    // Create a pending purchase record
    const purchaseId = await ctx.runMutation(internal.purchases.createPending, {
      userId: args.userId,
      productId: args.productId,
      paymentMethod: "pix",
    });

    const body: CreatePaymentBody = {
      frequency: "ONE_TIME",
      methods: ["PIX"],
      products: [
        {
          externalId: purchaseId,
          name: product.name,
          description: product.description,
          quantity: 1,
          price: product.pixPriceInCents,
        },
      ],
      returnUrl: `${process.env.SITE_URL}/${product.slug}?purchaseId=${purchaseId}`,
      completionUrl: `${process.env.SITE_URL}/checkout/success?purchaseId=${purchaseId}`,
      customer: {
        name: user.name,
        cellphone: user.phone,
        email: user.email,
        taxId: user.cpf,
      },
    };

    const response = await fetch(endpoints.createPayment, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ABACATE_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const responseData: CreatePaymentResponse = await response.json();

    if (responseData.error !== null) {
      console.error({
        error: responseData.error,
        message: responseData.message,
        statusCode: responseData.statusCode,
        code: responseData.code,
      });
      throw new Error(responseData.error);
    }

    const {
      data: { url, id: paymentIntentId },
    } = responseData;

    // Update the purchase with the payment intent ID
    await ctx.runMutation(internal.purchases.updatePaymentIntent, {
      purchaseId,
      paymentIntentId,
    });

    return url;
  },
});

export const fulfill = internalAction({
  args: {
    payload: v.string(),
  },
  handler: async ({ runMutation, runQuery }, { payload }) => {
    try {
      const webhookData = JSON.parse(payload) as PixWebhookResponse;

      // Only process paid events
      if (webhookData.event !== "billing.paid") {
        return { success: true };
      }

      const { billing } = webhookData.data;

      // Process each product in the billing
      for (const product of billing.products) {
        const purchaseId = product.externalId as Id<"purchases">;

        // Find the pending purchase for this product
        const purchase = await runQuery(internal.purchases.get, {
          id: purchaseId,
        });

        if (!purchase) {
          console.error(`No pending purchase found for product ${purchaseId}`);
          continue;
        }

        // Mark the purchase as completed
        await runMutation(internal.purchases.markCompleted, {
          purchaseId: purchase._id,
        });

        // If this is a credit purchase, add credits to the user's account
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
        }
      }

      return { success: true };
    } catch (err) {
      console.error("Error processing PIX webhook:", err);
      return { success: false, error: (err as { message: string }).message };
    }
  },
});
