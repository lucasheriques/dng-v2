"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const tools = [
  {
    name: "Formatador JSON",
    href: "/ferramentas/json",
  },
  // Add more tools here as we create them
];

export function ToolsSidebar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "w-64 h-dvh sticky overflow-y-auto transition-[top] duration-200",
        isScrolled ? "top-0" : "top-20"
      )}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Ferramentas</h2>
        <div className="space-y-1">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={cn(
                "block p-2 rounded-md hover:bg-slate-800/50 transition-colors",
                pathname === tool.href && "bg-slate-800/50 text-teal-500"
              )}
            >
              <div className="font-medium">{tool.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
