"use client";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Newspaper, Search as SearchIcon, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  MENTORSHIP_LINKS,
  SOCIAL_LINKS,
  SOCIALS,
  TOOLS,
} from "@/lib/constants";
import { DialogTitle } from "@radix-ui/react-dialog";

import ArticleList from "@/lib/article-list.json";
import { searchAtom } from "@/lib/atoms";
import { useAtom } from "jotai";

// Function to normalize strings for accent-insensitive search
const normalizeString = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

// Custom filter function for accent and case insensitive search
const customFilter = (value: string, search: string): number => {
  const normalizedValue = normalizeString(value);
  const normalizedSearch = normalizeString(search);

  if (normalizedValue.includes(normalizedSearch)) {
    return 1;
  }
  return 0;
};

export function Search({ size = "icon" }: { size?: "icon" | "default" }) {
  const router = useRouter();
  const [open, setOpen] = useAtom(searchAtom);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {size === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label="Pesquisar"
        >
          <SearchIcon size={16} />
        </Button>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          aria-label="Pesquisar"
          variant="outline"
        >
          Pesquisar
        </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <VisuallyHidden.Root>
          <DialogTitle>Pesquise por um conteúdo ou ferramenta</DialogTitle>
        </VisuallyHidden.Root>
        <Command filter={customFilter}>
          <CommandInput placeholder="Pesquise por um conteúdo ou ferramenta" />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup heading="Ferramentas">
              {Object.values(TOOLS).map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => {
                    handleClose();
                    router.push(item.href);
                  }}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Recursos da mentoria">
              {Object.values(MENTORSHIP_LINKS).map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => {
                    handleClose();
                    router.push(item.href);
                  }}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Links">
              {Object.values(SOCIAL_LINKS).map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.title}
                  onSelect={() => {
                    handleClose();
                    router.push(item.href);
                  }}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Artigos">
              <CommandItem
                value="Como virar um dev na gringa (compilado de artigos)"
                onSelect={() => {
                  handleClose();
                  router.push("/como-virar-um-dev-na-gringa");
                }}
              >
                <Star />
                Como virar um dev na gringa (compilado de artigos)
              </CommandItem>
              {ArticleList.map((item) => (
                <CommandItem
                  key={item.slug}
                  value={item.title}
                  onSelect={() => {
                    handleClose();
                    router.push(`${SOCIALS.newsletter}/p/${item.slug}`);
                  }}
                >
                  <Newspaper />
                  <span className="truncate">{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
