"use client";

import { searchAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";
import { useSetAtom } from "jotai";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export function BottomSearchFab() {
  const [visible, setVisible] = useState(false);
  const setSearchOpen = useSetAtom(searchAtom);

  const handleScroll = () => {
    const shouldShow = window.scrollY > 100;
    setVisible(shouldShow);
  };

  const handleOpen = () => {
    setSearchOpen(true);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Button
      size="icon"
      variant="outline"
      className={cn(
        "fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full shadow-lg",
        "hover:shadow-xl hover:scale-105",
        "transition-all duration-300 ease-in-out",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-16 opacity-0 pointer-events-none"
      )}
      onClick={handleOpen}
      aria-label="Pesquisar"
    >
      <Search size={20} />
    </Button>
  );
}
