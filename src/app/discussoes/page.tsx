"use client";

import { Sidebar } from "@/app/discussoes/components/sidebar";
import { mockPosts } from "@/app/discussoes/mock-posts";
import { PageWrapper } from "@/components/page-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePostHog } from "posthog-js/react";
import { PostList } from "./components/post-list";
import { ResponsiveFilters } from "./components/responsive-filters";

export default function Forum() {
  const posthog = usePostHog();

  const isDiscussionsEnabled = posthog.isFeatureEnabled("isDiscussionsEnabled");

  console.log(isDiscussionsEnabled);

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
    <PageWrapper className="flex gap-4 md:pt-0">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="flex-1">
        <Tabs defaultValue="populares" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="bg-secondary">
              <TabsTrigger value="populares">Populares</TabsTrigger>
              <TabsTrigger value="recentes">Recentes</TabsTrigger>
            </TabsList>
            <ResponsiveFilters />
          </div>
          <TabsContent
            value="populares"
            className="space-y-4 focus-visible:ring-0"
          >
            <PostList posts={mockPosts} />
          </TabsContent>
          <TabsContent
            value="recentes"
            className="space-y-4 focus-visible:ring-0"
          >
            <PostList posts={[...mockPosts].reverse()} />
          </TabsContent>
        </Tabs>
      </main>
    </PageWrapper>
  );
}
