import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { slugify } from "../utils/slugify";

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const authorId = await getAuthUserId(ctx);
    if (!authorId) {
      throw new Error("Not authenticated");
    }

    const slug = slugify(args.title);

    console.log("content", args.content);

    const postId = await ctx.db.insert("posts", {
      title: args.title,
      content: args.content,
      slug,
      authorId: authorId,
      votes: 0,
      viewCount: 0,
      updatedAt: Date.now(),
    });

    // Record the activity
    await ctx.db.insert("userActivity", {
      userId: authorId,
      activityType: "post_created",
      targetId: postId,
    });

    return postId;
  },
});
