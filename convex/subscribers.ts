import { v } from "convex/values";
import { query } from "./_generated/server";

export const getSubscriberStats = query(async (ctx) => {
  const subscribers = await ctx.db.query("subscribers").collect();

  const totalSubscribers = subscribers.length;
  const paidSubscribers = subscribers.filter(
    (sub) => sub.paidSubscription
  ).length;

  return {
    totalSubscribers,
    paidSubscribers,
  };
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});
