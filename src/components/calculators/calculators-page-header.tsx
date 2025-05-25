"use client";

import { CalculatorLinks } from "@/components/calculator-links";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "usehooks-ts";

interface Props {
  title: React.ReactNode;
  description?: React.ReactNode;
  handleClear?: () => void;
}

export function CalculatorsPageHeader({ title, handleClear }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <>
      <CalculatorLinks />
      <div className="flex md:items-center justify-between md:flex-row flex-col gap-2 md:gap-4">
        <h1 className="text-xl md:text-3xl font-bold text-highlight-text">
          {title}
        </h1>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => {
              const hyvorTalkContainer =
                document.querySelector("#hyvor-comments");
              hyvorTalkContainer?.scrollIntoView({ behavior: "smooth" });
            }}
            size={isMobile ? "xs" : "default"}
          >
            Deixar feedback
          </Button>
          {handleClear && (
            <Button
              variant="ghost"
              onClick={handleClear}
              size={isMobile ? "xs" : "default"}
            >
              Limpar valores
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
