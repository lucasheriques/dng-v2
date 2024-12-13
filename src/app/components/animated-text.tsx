"use client";

import { cn } from "@/lib/utils";
import * as m from "motion/react-m";

type Props = {
  text: string;
  delay?: number;
  className?: string;
  separatedWords?: boolean;
};

export default function AnimatedText({
  text,
  delay = 0,
  className = "",
  separatedWords = true,
}: Props) {
  const words = text.split(" ");

  if (!separatedWords) {
    return (
      <m.span
        className={cn("inline-block", className)}
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{
          opacity: { delay: delay * 0.05, duration: 0.3 },
          filter: { delay: delay * 0.05 + 0.3, duration: 0.3 },
        }}
      >
        {text}
      </m.span>
    );
  }

  return (
    <span>
      {words.map((word, index) => (
        <m.span
          key={index}
          className={cn("inline-block", className)}
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            opacity: { delay: delay + index * 0.05, duration: 0.3 },
            filter: { delay: delay + index * 0.05 + 0.3, duration: 0.3 },
          }}
        >
          {word}
          {index < words.length - 1 && "\u00A0"}
        </m.span>
      ))}
    </span>
  );
}
