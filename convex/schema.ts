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
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_author", ["authorId"]),

  comments: defineTable({
    content: v.string(),
    authorId: v.id("users"),
    postId: v.id("posts"),
    parentCommentId: v.optional(v.id("comments")),
    votes: v.number(),
    createdAt: v.number(),
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
    createdAt: v.number(),
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
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_activity_type", ["activityType"]),

  subscribers: defineTable({
    email: v.string(),
    paidSubscription: v.boolean(),
    subscribedAt: v.string(),
  }).index("by_email", ["email"]),
});
