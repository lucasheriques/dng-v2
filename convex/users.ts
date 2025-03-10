import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    const user = await ctx.db.get(id);

    if (!user) {
      return null;
    }

    return user;
  },
});

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.email) {
      throw new Error("User email not found");
    }

    const subscription = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", user.email!))
      .first();

    return {
      user,
      hasPaidSubscription: !!subscription?.paidSubscription,
      subscription,
    };
  },
});
