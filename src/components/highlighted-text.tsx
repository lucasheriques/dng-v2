"use client";
import { cn } from "@/lib/utils";
import { useAnimation } from "motion/react";
import * as m from "motion/react-m";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const bgColors = {
  primary: "bg-primary/40",
  pink: "bg-pink-500/40",
  yellow: "bg-yellow-500/40",
  emerald: "bg-emerald-500/40",
  blue: "bg-blue-500/40",
  purple: "bg-purple-500/40",
  red: "bg-red-500/40",
  "accent-secondary": "bg-accent-secondary",
} as const;

interface HighlightedTextProps {
  children: React.ReactNode;
  className?: string;
  color?: keyof typeof bgColors;
  delay?: number;
}

export function HighlightedText({
  children,
  className = "",
  color = "primary",
  delay = 300,
}: HighlightedTextProps) {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 1,
    delay,
  });

  useEffect(() => {
    if (inView) {
      setTimeout(() => {
        controls.start("visible");
      }, delay);
    }
  }, [controls, inView, delay]);

  return (
    <span className={cn("relative px-1", className)} ref={ref}>
      <span className="relative z-10 font-semibold text-white">{children}</span>
      <m.span
        initial="hidden"
        animate={controls}
        variants={{
          hidden: {
            width: "0%",
          },
          visible: {
            width: "100%",
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 30,
              duration: 0.8,
            },
          },
        }}
        className={cn(
          "absolute bottom-0 left-0 h-full rounded",
          bgColors[color]
        )}
      />
    </span>
  );
}
