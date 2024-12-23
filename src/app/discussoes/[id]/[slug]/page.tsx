import { CommentSection } from "@/app/discussoes/components/comment-section";
import { PostDetail } from "@/app/discussoes/components/post-detail";
import { PageWrapper } from "@/components/page-wrapper";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const postId = (await params).id as Id<"posts">;
  const preloadedPost = await preloadQuery(api.posts.queries.getPostById, {
    postId,
  });

  return (
    <PageWrapper>
      <PostDetail preloadedPost={preloadedPost} />
      <CommentSection />
    </PageWrapper>
  );
}
