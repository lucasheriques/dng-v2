"use client";

import { useAnimate, useInView } from "motion/react";

import { ReactNode, useEffect, useRef } from "react";

interface AnimatedStatProps {
  value?: number;
  label: ReactNode;
  color: string;
  isLoading?: boolean;
}

export function AnimatedStat({ value, label, color }: AnimatedStatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scope, animate] = useAnimate();
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (isInView && value) {
      animate(0, value, {
        type: "spring",
        stiffness: 100,
        damping: 30,
        onUpdate: (latest) => {
          scope.current!.innerHTML = `${Math.round(latest)}`;
        },
      });
    }
  }, [isInView, value, animate, scope]);

  return (
    <div
      ref={containerRef}
      className="text-center group hover:scale-110 transition-transform duration-200"
    >
      <span ref={scope} className={`text-3xl font-bold ${color}`}>
        0
      </span>
      <div className="text-slate-400">{label}</div>
    </div>
  );
}
