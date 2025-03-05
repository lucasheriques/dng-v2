import { v } from "convex/values";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import {
  internalAction,
  internalMutation,
  internalQuery,
  MutationCtx,
} from "./_generated/server";

type Subscriber = Omit<Doc<"subscribers">, "_id" | "_creationTime">;

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
  const subscribersMap = rows
    .slice(1)
    .filter((row) => row.trim() !== "")
    .reduce(
      (acc, row) => {
        const [email, active_subscription, , , created_at] = row.split(",");
        acc[email] = {
          email,
          paidSubscription: active_subscription === "true",
          subscribedAt: created_at,
        };
        return acc;
      },
      {} as Record<
        string,
        { email: string; paidSubscription: boolean; subscribedAt: string }
      >
    );

  return subscribersMap;
}

export const getSubscribers = internalQuery({
  handler: async (ctx) => {
    return await ctx.db.query("subscribers").collect();
  },
});

export const upsertSubscriberMutation = internalMutation({
  args: {
    subscriber: v.object({
      email: v.string(),
      paidSubscription: v.boolean(),
      subscribedAt: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await upsertSubscriber(ctx, args.subscriber);
  },
});

export const syncSubscribers = internalAction({
  handler: async (ctx) => {
    const cookie = process.env.SUBSTACK_AUTH_COOKIE;
    if (!cookie) {
      throw new Error("SUBSTACK_AUTH_COOKIE is not set");
    }

    const csv = await downloadSignups(cookie);
    const substackSubscribers = parseCSV(csv);

    const existingSubscribers = await ctx.runQuery(
      internal.getSubs.getSubscribers
    );

    const returnInfo = {
      numberOfRemovedSubscribers: 0,
      numberOfUpdatedSubscribers: 0,
      numberOfNewSubscribers: 0,
    };

    for (const subscriber of existingSubscribers) {
      // remove subscriber if not in substack
      try {
        if (subscriber.email === "lucasheriques@gmail.com") {
          // skip lucasheriques@gmail.com
          continue;
        }

        if (!substackSubscribers[subscriber.email]) {
          await ctx.runMutation(internal.getSubs.removeSubscriber, {
            id: subscriber._id,
          });
          console.log(`Removed subscriber ${subscriber.email}`);
          returnInfo.numberOfRemovedSubscribers++;
          continue;
        }

        // upsert subscriber if paidSubscription has changed
        if (
          substackSubscribers[subscriber.email].paidSubscription !==
          subscriber.paidSubscription
        ) {
          console.log(
            `Updating subscriber ${subscriber.email} with paidSubscription ${substackSubscribers[subscriber.email].paidSubscription}`
          );
          await ctx.runMutation(internal.getSubs.upsertSubscriberMutation, {
            subscriber: substackSubscribers[subscriber.email],
          });
        }
      } catch (error) {
        console.error(
          `Error upserting subscriber ${subscriber.email}: ${error}`
        );
        console.error(
          `Checking subscriber ${subscriber.email}. Substack: ${substackSubscribers[subscriber.email]?.paidSubscription}. Local: ${subscriber.paidSubscription}`
        );
      }
    }

    // add new subscribers
    for (const subscriber of Object.values(substackSubscribers)) {
      if (!existingSubscribers.find((s) => s.email === subscriber.email)) {
        console.log(`Adding new subscriber ${subscriber.email}`);
        await ctx.runMutation(internal.getSubs.upsertSubscriberMutation, {
          subscriber,
        });
        returnInfo.numberOfNewSubscribers++;
      }
    }

    return returnInfo;
  },
});

export const upsertSubscribersBatch = internalMutation({
  args: {
    subscribers: v.array(
      v.object({
        email: v.string(),
        paidSubscription: v.boolean(),
        subscribedAt: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    let numberOfNewSubscribers = 0;
    let numberOfUpdatedSubscribers = 0;

    await Promise.all(
      args.subscribers.map(async (sub) => {
        const result = await upsertSubscriber(ctx, sub);

        if (result.created) {
          numberOfNewSubscribers++;
        } else if (result.updated) {
          numberOfUpdatedSubscribers++;
        }
      })
    );

    console.log(
      `Upserted ${numberOfNewSubscribers} new subscribers and ${numberOfUpdatedSubscribers} updated subscribers`
    );

    return `Upserted ${numberOfNewSubscribers} new subscribers and ${numberOfUpdatedSubscribers} updated subscribers`;
  },
});

export const removeSubscriber = internalMutation({
  args: {
    id: v.id("subscribers"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

const upsertSubscriber = async (ctx: MutationCtx, args: Subscriber) => {
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
};
