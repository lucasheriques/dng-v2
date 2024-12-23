import { query } from "../_generated/server";

import { v } from "convex/values";

export const getFirstTwentyPosts = query({
  args: {
    sortBy: v.optional(v.union(v.literal("recent"), v.literal("popular"))),
  },
  handler: async (ctx, args) => {
    const postsQuery = await ctx.db.query("posts").take(20);

    if (args.sortBy === "popular") {
      return postsQuery.sort((a, b) => b.votes - a.votes);
    }

    return postsQuery;
  },
});

export const getPostById = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) return null;

    // TODO: Increment view count
    // await ctx.db.patch(args.postId, {
    //   viewCount: (post.viewCount || 0) + 1,
    // });

    return post;
  },
});
