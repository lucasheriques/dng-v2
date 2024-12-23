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
