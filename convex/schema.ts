import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,
  subscribers: defineTable({
    email: v.string(),
    paidSubscription: v.boolean(),
    subscribedAt: v.string(),
  }).index("by_email", ["email"]),
});
