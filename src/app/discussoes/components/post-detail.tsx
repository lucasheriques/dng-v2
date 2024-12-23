"use client";

import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils";
import { api } from "@convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowUp, Eye } from "lucide-react";

interface PostDetailProps {
  preloadedPost: Preloaded<typeof api.posts.queries.getPostById>;
}

export function PostDetail({ preloadedPost }: PostDetailProps) {
  const post = usePreloadedQuery(preloadedPost);

  if (!post) return <div>Post not found</div>;

  return (
    <article className="space-y-8 py-8">
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{post.votes}</span>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>
                {post.viewCount.toLocaleString("pt-BR")} visualizações
              </span>
            </div>
            <span>•</span>
            <span>{formatRelativeTime(new Date(post.createdAt))}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
