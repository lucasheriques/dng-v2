"use client";
import { Button } from "@/components/ui/button";
import { searchAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";

export function SearchButton() {
  const setSearchOpen = useSetAtom(searchAtom);

  return (
    <Button
      onClick={() => setSearchOpen(true)}
      aria-label="Pesquisar"
      variant="outline"
    >
      Pesquisar
    </Button>
  );
}
