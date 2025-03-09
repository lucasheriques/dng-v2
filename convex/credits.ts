import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

// Get a user's credit balance
export const getBalance = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userCredits = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    return userCredits?.balance ?? 0;
  },
});

// Add credits to a user's account
export const add = internalMutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const userCredits = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();

    if (userCredits) {
      // Update existing record
      await ctx.db.patch(userCredits._id, {
        balance: userCredits.balance + args.amount,
        lastUpdated: now,
      });
    } else {
      // Create new record
      await ctx.db.insert("userCredits", {
        userId: args.userId,
        balance: args.amount,
        lastUpdated: now,
      });
    }

    return true;
  },
});

// Remove credits from a user's account
export const remove = internalMutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const userCredits = await ctx.db
      .query("userCredits")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (!userCredits) {
      return false; // No credits to remove
    }

    const newBalance = Math.max(0, userCredits.balance - args.amount);

    await ctx.db.patch(userCredits._id, {
      balance: newBalance,
      lastUpdated: Date.now(),
    });

    return true;
  },
});
