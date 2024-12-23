"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";
import { PenSquare } from "lucide-react";
import { useState } from "react";
import { MarkdownEditor } from "./markdown-editor";

export function CreatePostModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createPost = useMutation(api.posts.mutations.createPost);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o título e o conteúdo do post.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost({ title, content });
      toast({
        title: "Post criado com sucesso!",
        description: "Seu post foi publicado na comunidade.",
      });
      setIsOpen(false);
      setTitle("");
      setContent("");
    } catch {
      toast({
        title: "Erro ao criar post",
        description: "Ocorreu um erro ao criar seu post. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PenSquare className="h-4 w-4" />
          Criar post
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="px-0">
          <DialogTitle>Criar novo post</DialogTitle>
          <DialogDescription>
            Compartilhe sua dúvida ou conhecimento com a comunidade. Markdown
            para formatação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          <div className="space-y-2">
            <Input
              placeholder="Título do post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-0 p-0 text-xl md:text-xl font-semibold placeholder:text-muted-foreground/50 focus-visible:ring-0"
            />
          </div>

          <div>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Escreva o conteúdo do seu post..."
            />
          </div>
        </div>

        <DialogFooter className="px-0">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Publicando..." : "Publicar post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
