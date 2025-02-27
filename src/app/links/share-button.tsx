"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButton() {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Dev na Gringa - Links",
          text: "Confira todos os links importantes do Dev na Gringa",
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copiado!",
          description: "O link foi copiado para a área de transferência.",
        });
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="absolute top-4 right-4 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
      onClick={handleShare}
      disabled={isSharing}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Compartilhar
    </Button>
  );
}
