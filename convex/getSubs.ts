import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalMutation } from "./_generated/server";

const SUBSTACK_BASE_URL = "https://newsletter.nagringa.dev/api/v1";

const defaultHeaders = {
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.9",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  Referer: "https://newsletter.nagringa.dev/publish/stats/traffic",
};

async function downloadSignups(cookie: string) {
  const response = await fetch(`${SUBSTACK_BASE_URL}/download_signups`, {
    headers: {
      ...defaultHeaders,
      Cookie: cookie,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.text();
}

function parseCSV(csv: string) {
  const rows = csv.split("\n");
  return rows
    .slice(1)
    .filter((row) => row.trim() !== "")
    .map((row) => {
      const [email, active_subscription, , , created_at] = row.split(",");
      return {
        email,
        active_subscription: active_subscription === "true",
        created_at,
      };
    });
}

export const syncSubscribers = internalAction({
  handler: async (ctx) => {
    const cookie = process.env.SUBSTACK_AUTH_COOKIE;
    if (!cookie) {
      throw new Error("SUBSTACK_AUTH_COOKIE is not set");
    }

    const csv = await downloadSignups(cookie);
    const subscribers = parseCSV(csv);

    // Batch update subscribers in chunks to avoid timeout
    const BATCH_SIZE = 5000;
    const messages: string[] = [];
    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);
      const message = await ctx.runMutation(
        internal.getSubs.upsertSubscribersBatch,
        {
          subscribers: batch,
        }
      );
      messages.push(message);
    }

    return messages.join("\n");
  },
});

export const upsertSubscribersBatch = internalMutation({
  args: {
    subscribers: v.array(
      v.object({
        email: v.string(),
        active_subscription: v.boolean(),
        created_at: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    let numberOfNewSubscribers = 0;
    let numberOfUpdatedSubscribers = 0;

    for await (const sub of args.subscribers) {
      const upsertResult = await ctx.runMutation(
        internal.getSubs.upsertSubscriber,
        {
          email: sub.email,
          paidSubscription: sub.active_subscription,
          subscribedAt: sub.created_at,
        }
      );

      if (upsertResult.created) {
        numberOfNewSubscribers++;
      } else if (upsertResult.updated) {
        numberOfUpdatedSubscribers++;
      }
    }

    return `Upserted ${numberOfNewSubscribers} new subscribers and ${numberOfUpdatedSubscribers} updated subscribers`;
  },
});

export const upsertSubscriber = internalMutation({
  args: {
    email: v.string(),
    paidSubscription: v.boolean(),
    subscribedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // only update if the paidSubscription has changed
      if (existing.paidSubscription === args.paidSubscription) {
        return { created: false, updated: false };
      }

      await ctx.db.patch(existing._id, {
        paidSubscription: args.paidSubscription,
        subscribedAt: args.subscribedAt,
      });
      return { created: false, updated: true };
    }

    const id = await ctx.db.insert("subscribers", {
      email: args.email,
      paidSubscription: args.paidSubscription,
      subscribedAt: args.subscribedAt,
    });

    return { id, created: true, updated: false };
  },
});
