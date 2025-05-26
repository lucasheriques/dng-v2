"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface ExpandableCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function ExpandableCard({
  title,
  icon,
  children,
  defaultOpen = false,
  className = "",
}: ExpandableCardProps) {
  return (
    <Card
      className={`bg-gradient-to-br from-slate-900/50 to-slate-950/50 border-slate-700/50 ${className}`}
    >
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={defaultOpen ? "expandable-content" : undefined}
      >
        <AccordionItem value="expandable-content" className="border-none">
          <AccordionTrigger className="px-4 py-4 hover:no-underline">
            <div className="flex items-center gap-2 text-left">
              {icon}
              <span className="text-sm md:text-lg font-semibold">{title}</span>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="p-4 text-base">{children}</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
