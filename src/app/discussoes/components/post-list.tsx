"use client";

import { Post } from "@/app/discussoes/types/forum";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime } from "@/lib/utils";
import {
  ArrowUp,
  Eye,
  Link2,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PostListProps {
  posts: Post[];
}

export function PostList({ posts }: PostListProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, posts.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (event.key === "Enter" && posts[selectedIndex]) {
        // Navigate to post detail page
        console.log(`Navigating to post ${posts[selectedIndex].id}`);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [posts, selectedIndex]);

  useEffect(() => {
    const selectedElement = document.getElementById(`post-${selectedIndex}`);
    if (selectedElement && containerRef.current) {
      selectedElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  return (
    <div ref={containerRef} className="space-y-4 nice-scrollbar">
      {posts.map((post, index) => (
        <div
          key={post.id}
          id={`post-${index}`}
          className={`flex gap-4 p-4 rounded-lg transition-colors ${
            index === selectedIndex
              ? "ring-2 ring-teal-950"
              : "hover:bg-accent/5"
          }`}
        >
          <div className="flex flex-col items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-primary/10"
              onClick={() => console.log("Upvote")}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{post.votes}</span>
          </div>

          <div className="flex-1 space-y-2">
            <h3 className="font-medium hover:text-primary transition-colors">
              <a href={`/posts/${post.id}`}>{post.title}</a>
            </h3>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <span>{post.author.role}</span>
                <span>na</span>
                <span className="font-medium text-foreground">
                  {post.author.company}
                </span>
              </div>
              <span>•</span>
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>
                  {post.viewCount.toLocaleString("pt-BR")} visualizações
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.commentCount} comentários</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-primary hover:bg-primary/10"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Mais ações</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link2 className="mr-2 h-4 w-4" />
                    Copiar link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-[hsl(var(--accent-secondary))]">
                    Reportar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
