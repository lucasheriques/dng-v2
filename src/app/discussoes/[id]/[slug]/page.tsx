import { CommentSection } from "@/app/discussoes/components/comment-section";
import { PageWrapper } from "@/components/page-wrapper";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const postId = (await params).id as Id<"posts">;
  const post = await fetchQuery(api.posts.queries.getPostById, {
    postId,
  });

  return {
    title: post?.title ? `${post.title} | Dev na Gringa` : "Dev na Gringa",
    description:
      post?.content?.slice(0, 160) ?? "Uma discussão na Dev na Gringa",
  };
}

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
      <h1>{post.title}</h1>
      <article className="prose max-w-full text-lg dark:prose-invert">
        <MDXRemote source={post.content} />
      </article>
      <CommentSection />
    </PageWrapper>
  );
}
