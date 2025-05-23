import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Share2, X } from "lucide-react";
import { useState } from "react";

const MESSAGES = {
  idle: (
    <>
      <Share2 className="size-4 ml-2" />
      Compartilhar resultado
    </>
  ),
  copied: (
    <>
      <Check className="size-4 ml-2" />
      URL copiada!
    </>
  ),
  error: (
    <>
      <X className="size-4 ml-2" />
      Tente copiar novamente
    </>
  ),
};

interface Props {
  onShare: () => Promise<boolean>;
  className?: string;
}

export function ShareButton({ onShare, className }: Props) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">(
    "idle"
  );

  const handleShare = async () => {
    const copiedSuccessfully = await onShare();
    setCopyStatus(copiedSuccessfully ? "copied" : "error");
    setTimeout(() => {
      setCopyStatus("idle");
    }, 2000);
  };

  return (
    <Button
      onClick={handleShare}
      key={copyStatus}
      className={cn("motion-preset-focus-sm", className)}
    >
      {MESSAGES[copyStatus]}
    </Button>
  );
}
