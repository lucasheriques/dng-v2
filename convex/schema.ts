import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    cpf: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    role: v.optional(
      v.union(v.literal("admin"), v.literal("moderator"), v.literal("user"))
    ),
  }).index("email", ["email"]),

  posts: defineTable({
    title: v.string(),
    content: v.string(),
    slug: v.string(),
    authorId: v.id("users"),
    votes: v.number(),
    viewCount: v.number(),
    updatedAt: v.number(),
  }).index("by_author", ["authorId"]),

  comments: defineTable({
    content: v.string(),
    authorId: v.id("users"),
    postId: v.id("posts"),
    parentCommentId: v.optional(v.id("comments")),
    votes: v.number(),
    updatedAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"])
    .index("by_parent", ["parentCommentId"]),

  votes: defineTable({
    userId: v.id("users"),
    targetType: v.union(v.literal("post"), v.literal("comment")),
    targetId: v.string(),
    value: v.number(),
  })
    .index("by_user_and_target", ["userId", "targetType", "targetId"])
    .index("by_target", ["targetType", "targetId"]),

  userActivity: defineTable({
    userId: v.id("users"),
    activityType: v.union(
      v.literal("post_created"),
      v.literal("post_edited"),
      v.literal("comment_created"),
      v.literal("comment_edited"),
      v.literal("post_voted"),
      v.literal("comment_voted")
    ),
    targetId: v.string(),
    metadata: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_activity_type", ["activityType"]),

  subscribers: defineTable({
    email: v.string(),
    paidSubscription: v.boolean(),
    subscribedAt: v.string(),
  }).index("by_email", ["email"]),

  // New tables for the paid content system
  products: defineTable({
    name: v.string(),
    description: v.string(),
    type: v.union(v.literal("book"), v.literal("credit")),
    slug: v.string(),
    priceInCents: v.number(), // Price in cents
    pixPriceInCents: v.number(),
    currency: v.string(), // e.g., "BRL"
    isActive: v.boolean(),
    updatedAt: v.number(),
    previewAvailable: v.optional(v.boolean()), // Whether a preview is available
    metadata: v.optional(
      v.object({
        creditAmount: v.optional(v.number()),
        // Other product-specific metadata
      })
    ),
  })
    .index("by_type", ["type"])
    .index("by_slug", ["slug"]),

  purchases: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    paymentMethod: v.union(v.literal("stripe"), v.literal("pix")),
    paymentIntentId: v.optional(v.string()), // Stripe payment intent ID
    amount: v.number(), // Amount paid in cents
    currency: v.string(), // Currency code (e.g., BRL)
    purchaseDate: v.number(),
    refundDate: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_product_and_user", ["productId", "userId"])
    .index("by_payment_intent", ["paymentIntentId"]),

  userCredits: defineTable({
    userId: v.id("users"),
    balance: v.number(),
    lastUpdated: v.number(),
  }).index("by_user", ["userId"]),
});
