import { CreatePostModal } from "@/app/discussoes/components/create-post-modal";
import PostTabs from "@/app/discussoes/components/post-tabs";
import { PageWrapper } from "@/components/page-wrapper";
import { preloadQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function Discussions({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sortBy = (await searchParams).sortBy;

  const preloadedPosts = await preloadQuery(
    api.posts.queries.getFirstTwentyPosts,
    {
      sortBy: sortBy as "recent" | "popular" | undefined,
    }
  );

  return (
    <PageWrapper className="flex gap-4">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Discussões</h1>
          <CreatePostModal />
        </div>
        <PostTabs preloadedPosts={preloadedPosts} />
      </div>
    </PageWrapper>
  );
}
