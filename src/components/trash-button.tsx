"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface TrashButtonProps {
  onClick: () => void;
  ariaLabel: string;
}

export function TrashButton({ onClick, ariaLabel }: TrashButtonProps) {
  return (
    <Button
      variant="ghost"
      type="button"
      size="icon"
      className="shrink-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
