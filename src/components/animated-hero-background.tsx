"use client";

import { motion } from "framer-motion";

export function AnimatedHeroBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  if (true) {
    return (
      <>
        <div className="absolute inset-0 z-0 overflow-hidden">
          {children}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0118] via-[#0A0118]/50 to-transparent" />
        </div>
      </>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 z-0 overflow-hidden"
      initial={{
        clipPath: "circle(0% at 50% 50%)",
        opacity: 1,
      }}
      animate={{
        clipPath: "circle(150% at 50% 50%)",
        opacity: 1,
      }}
      transition={{
        duration: 1.5,
        ease: [0.4, 0, 0.2, 1],
        clipPath: {
          duration: 1.5,
          ease: [0.4, 0, 0.2, 1],
        },
      }}
    >
      {children}
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0118] via-[#0A0118]/50 to-transparent" />
    </motion.div>
  );
}
