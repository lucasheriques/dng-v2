import { CommentSection } from "@/app/discussoes/components/comment-section";
import { PageWrapper } from "@/components/page-wrapper";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { MDXRemote } from "next-mdx-remote/rsc";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const postId = (await params).id as Id<"posts">;

  const post = await fetchQuery(api.posts.queries.getPostById, {
    postId,
  });

  console.log(post?.content);

  if (!post?.content) {
    return <div>Post not found</div>;
  }

  return (
    <PageWrapper>
      <article className="prose max-w-full text-lg dark:prose-invert">
        <h1>{post.title}</h1>
        <MDXRemote source={post.content} />
      </article>
      <CommentSection />
    </PageWrapper>
  );
}
