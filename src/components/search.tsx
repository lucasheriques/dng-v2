"use client";

import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Calculator, Newspaper, Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { MENTORSHIP_LINKS, SOCIAL_LINKS, SOCIALS } from "@/lib/constants";
import { DialogTitle } from "@radix-ui/react-dialog";

import ArticleList from "@/lib/article-list.json";
import { searchAtom } from "@/lib/atoms";
import { useAtom } from "jotai";

export function Search() {
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Pesquisar"
      >
        <SearchIcon size={16} />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <VisuallyHidden.Root>
          <DialogTitle>Pesquise por um conteúdo ou ferramenta</DialogTitle>
        </VisuallyHidden.Root>
        <CommandInput placeholder="Pesquise por um conteúdo ou ferramenta" />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Ferramentas">
            <CommandItem
              onSelect={() => {
                handleClose();
                router.push("/calculadora-clt-vs-pj");
              }}
            >
              <Calculator />
              <span>Calculadora Salário CLT vs PJ</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Recursos da mentoria">
            {Object.values(MENTORSHIP_LINKS).map((item) => (
              <CommandItem
                key={item.href}
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
            {ArticleList.map((item) => (
              <CommandItem
                key={item.slug}
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
      </CommandDialog>
    </>
  );
}
