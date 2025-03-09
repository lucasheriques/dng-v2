import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

// Check if a user has access to a product
export const checkAccess = query({
  args: {
    productSlug: v.string(),
    chapterId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { hasAccess: false };

    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.productSlug))
      .first();

    if (!product) return { hasAccess: false };

    // Check if the first chapter is free for preview
    if (product.previewAvailable && args.chapterId === 1) {
      return { hasAccess: true, isPreview: true };
    }

    // Check if user has a completed purchase for this product
    const purchase = await ctx.db
      .query("purchases")
      .withIndex("by_product_and_user", (q) =>
        q.eq("productId", product._id).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("status"), "completed"))
      .first();

    if (purchase) {
      return { hasAccess: true };
    }

    // Check if user is a paid subscriber via Substack sync
    const user = await ctx.db.get(userId);
    if (!user || !user.email) return { hasAccess: false };

    const subscription = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", user.email as string))
      .filter((q) => q.eq(q.field("paidSubscription"), true))
      .first();

    return {
      hasAccess: !!subscription?.paidSubscription,
    };
  },
});

// Get user's purchase history
export const getUserPurchases = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Não autenticado");
    }

    const purchases = await ctx.db
      .query("purchases")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Fetch product details for each purchase
    const purchasesWithProducts = await Promise.all(
      purchases.map(async (purchase) => {
        const product = await ctx.db.get(purchase.productId);
        return {
          ...purchase,
          product,
        };
      })
    );

    return purchasesWithProducts;
  },
});

// Request a refund for a purchase
export const requestRefund = mutation({
  args: {
    purchaseId: v.id("purchases"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Não autenticado");
    }

    const purchase = await ctx.db.get(args.purchaseId);
    if (!purchase) {
      throw new Error("Compra não encontrada");
    }

    if (purchase.userId !== userId) {
      throw new Error("Não autorizado");
    }

    if (purchase.status !== "completed") {
      throw new Error("Apenas compras concluídas podem ser reembolsadas");
    }

    if (purchase.status === "completed") {
      throw new Error("Esta compra já foi reembolsada");
    }

    // Check if purchase is within 7-day refund window
    const now = Date.now();
    const purchaseDate = purchase.purchaseDate;
    const daysSincePurchase = (now - purchaseDate) / (1000 * 60 * 60 * 24);

    if (daysSincePurchase > 7) {
      throw new Error("O período de reembolso expirou (7 dias)");
    }

    // TODO: In a real implementation, we would process the refund through Stripe

    // Update purchase status to refunded
    await ctx.db.patch(args.purchaseId, {
      status: "refunded",
      refundDate: now,
    });

    return { success: true };
  },
});

// Internal functions for Stripe integration

// Get a purchase by ID
export const get = internalQuery({
  args: { id: v.id("purchases") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Check if a user has a purchase for a product
export const checkUserPurchase = internalQuery({
  args: {
    productId: v.id("products"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("purchases")
      .withIndex("by_product_and_user", (q) =>
        q.eq("productId", args.productId).eq("userId", args.userId)
      )
      .filter((q) => q.eq(q.field("status"), "completed"))
      .first();
  },
});

// Create a pending purchase
export const createPending = internalMutation({
  args: {
    userId: v.id("users"),
    productId: v.id("products"),
    paymentMethod: v.union(v.literal("stripe"), v.literal("pix")),
  },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Produto não encontrado");
    }

    return await ctx.db.insert("purchases", {
      userId: args.userId,
      productId: args.productId,
      status: "pending",
      paymentMethod: args.paymentMethod,
      amount: product.priceInCents,
      currency: product.currency,
      purchaseDate: Date.now(),
    });
  },
});

// Update payment intent ID
export const updatePaymentIntent = internalMutation({
  args: {
    purchaseId: v.id("purchases"),
    paymentIntentId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.purchaseId, {
      paymentIntentId: args.paymentIntentId,
    });
    return true;
  },
});

// Mark a purchase as completed
export const markCompleted = internalMutation({
  args: { purchaseId: v.id("purchases") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.purchaseId, {
      status: "completed",
    });
    return true;
  },
});

// Mark a purchase as refunded
export const markRefunded = internalMutation({
  args: { purchaseId: v.id("purchases") },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.purchaseId, {
      status: "refunded",
      refundDate: now,
    });
    return true;
  },
});
