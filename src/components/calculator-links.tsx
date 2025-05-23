"use client";
import { TOOLS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CALCULATORS = Object.values(TOOLS).filter((tool) =>
  tool.href.includes("calculadora")
);

export function CalculatorLinks() {
  const pathname = usePathname();
  return (
    <ul className="flex gap-4 text-xs md:text-sm">
      {CALCULATORS.map((calculator) => (
        <li key={calculator.href} className="first:pl-0 last:pr-0">
          <Link
            href={calculator.href}
            className={cn(
              pathname === calculator.href && "text-primary border-primary",
              "border-b-1 hover:border-b-2 transition-all"
            )}
          >
            {calculator.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
