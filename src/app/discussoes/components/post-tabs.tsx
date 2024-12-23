"use client";

import { PostList } from "@/app/discussoes/components/post-list";
import { ResponsiveFilters } from "@/app/discussoes/components/responsive-filters";
import { PageWrapper } from "@/components/page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { usePostHog } from "posthog-js/react";

export default function PostTabs({
  preloadedPosts,
}: {
  preloadedPosts: Preloaded<typeof api.posts.queries.getFirstTwentyPosts>;
}) {
  const posts = usePreloadedQuery(preloadedPosts);
  const posthog = usePostHog();

  const isDiscussionsEnabled = posthog.isFeatureEnabled("isDiscussionsEnabled");

  if (isDiscussionsEnabled === undefined || isDiscussionsEnabled === false) {
    return (
      <PageWrapper>
        <h1 className="text-2xl font-bold">
          Discussões não estão disponíveis no momento.
        </h1>
        <p>
          A funcionalidade de discussões ainda não está disponível para todos os
          usuários.
        </p>
      </PageWrapper>
    );
  }
  return (
    <Tabs defaultValue="populares" className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList className="bg-secondary">
          <TabsTrigger value="populares">Populares</TabsTrigger>
          <TabsTrigger value="recentes">Recentes</TabsTrigger>
        </TabsList>
        <ResponsiveFilters />
      </div>
      <TabsContent value="populares" className="space-y-4 focus-visible:ring-0">
        <PostList posts={posts} />
      </TabsContent>
      <TabsContent value="recentes" className="space-y-4 focus-visible:ring-0">
        <PostList posts={posts.reverse()} />
      </TabsContent>
    </Tabs>
  );
}
