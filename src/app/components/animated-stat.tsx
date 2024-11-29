"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedStatProps {
  value: number;
  label: string;
  color: string;
}

export function AnimatedStat({ value, label, color }: AnimatedStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (countRef.current) {
          countRef.current.textContent = `${Math.round(latest)}+`;
        }
      }),
    [springValue]
  );

  return (
    <motion.div
      ref={ref}
      className="text-center group"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div ref={countRef} className={`text-3xl font-bold ${color}`}>
        0+
      </div>
      <div className="text-white/60">{label}</div>
    </motion.div>
  );
}
