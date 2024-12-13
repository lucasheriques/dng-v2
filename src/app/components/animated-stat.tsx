"use client";

import { useAnimate, useInView } from "motion/react";
import * as m from "motion/react-m";

import { ReactNode, useEffect, useRef } from "react";

interface AnimatedStatProps {
  value: number;
  label: ReactNode;
  color: string;
}

export function AnimatedStat({ value, label, color }: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [scope, animate] = useAnimate();
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(0, value, {
        type: "spring",
        stiffness: 100,
        damping: 30,
        onUpdate: (latest) => {
          scope.current!.innerHTML = `${Math.round(latest)}+`;
        },
      });
    }
  }, [isInView, value, animate, scope]);

  return (
    <m.div
      ref={ref}
      className="text-center group"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div ref={scope} className={`text-3xl font-bold ${color}`}>
        0+
      </div>
      <div className="text-slate-400">{label}</div>
    </m.div>
  );
}
