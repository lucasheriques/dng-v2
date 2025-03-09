import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalQuery, mutation, query } from "./_generated/server";

// Create a new product (admin only)
export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    type: v.union(v.literal("book"), v.literal("credit")),
    slug: v.string(),
    price: v.number(),
    currency: v.string(),
    previewAvailable: v.optional(v.boolean()),
    metadata: v.optional(
      v.object({
        creditAmount: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Não autenticado");
    }

    // Check if user is an admin
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Não autorizado");
    }

    // Check if slug is already in use
    const existingProduct = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existingProduct) {
      throw new Error(`Produto com slug "${args.slug}" já existe`);
    }

    const now = Date.now();
    return await ctx.db.insert("products", {
      name: args.name,
      description: args.description,
      type: args.type,
      slug: args.slug,
      priceInCents: args.price,
      currency: args.currency,
      isActive: true,
      updatedAt: now,
      previewAvailable: args.previewAvailable ?? false,
      metadata: args.metadata,
    });
  },
});

// Get a product by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const getProductAndAccess = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (!product) return { product: null, hasAccess: false };

    const userId = await getAuthUserId(ctx);
    if (!userId) return { product, hasAccess: false };

    const purchase = await ctx.db
      .query("purchases")
      .withIndex("by_product_and_user", (q) =>
        q.eq("productId", product._id).eq("userId", userId)
      )
      .filter((q) => q.eq(q.field("status"), "completed"))
      .first();

    return {
      product,
      hasAccess: !!purchase,
    };
  },
});

// Get a product by ID (internal)
export const get = internalQuery({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// List all active products, optionally filtered by type
export const list = query({
  args: {
    type: v.optional(v.union(v.literal("book"), v.literal("credit"))),
  },
  handler: async (ctx, args) => {
    let productsQuery = ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true));

    if (args.type) {
      productsQuery = productsQuery.filter((q) =>
        q.eq(q.field("type"), args.type)
      );
    }

    return await productsQuery.collect();
  },
});

// Update a product (admin only)
export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    currency: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    previewAvailable: v.optional(v.boolean()),
    metadata: v.optional(
      v.object({
        creditAmount: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Não autenticado");
    }

    // Check if user is an admin
    const user = await ctx.db.get(userId);
    if (!user || user.role !== "admin") {
      throw new Error("Não autorizado");
    }

    const product = await ctx.db.get(args.id);
    if (!product) {
      throw new Error("Produto não encontrado");
    }

    const updates: Record<
      string,
      string | number | boolean | object | undefined
    > = {
      updatedAt: Date.now(),
    };

    // Only include fields that are provided
    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.price !== undefined) updates.price = args.price;
    if (args.currency !== undefined) updates.currency = args.currency;
    if (args.isActive !== undefined) updates.isActive = args.isActive;
    if (args.previewAvailable !== undefined)
      updates.previewAvailable = args.previewAvailable;
    if (args.metadata !== undefined) updates.metadata = args.metadata;

    return await ctx.db.patch(args.id, updates);
  },
});
