"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { MarkdownEditor } from "./markdown-editor";

interface CommentSectionProps {
  postId: Id<"posts">;
}

export function CommentSection() {
  const [comment, setComment] = useState("");

  return (
    <div className="mt-8 border-t pt-8">
      <h2 className="text-xl font-bold mb-4">Comentários</h2>

      <div className="space-y-4">
        <MarkdownEditor
          value={comment}
          onChange={setComment}
          placeholder="Escreva seu comentário..."
        />

        <div className="flex justify-end">
          <Button
            onClick={() => {
              // TODO: Implement comment submission
              console.log("Submit comment:", comment);
            }}
          >
            Comentar
          </Button>
        </div>
      </div>
    </div>
  );
}
