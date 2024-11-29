"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface HighlightedTextProps {
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
  delay?: number;
}

export function HighlightedText({
  children,
  className = "",
  bgColor = "bg-primary/40",
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
    <span className={`relative px-1 ${className}`} ref={ref}>
      {children}
      <motion.span
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
        className={`absolute bottom-0 left-0 -z-10 h-full rounded ${bgColor}`}
      />
    </span>
  );
}
