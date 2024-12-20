"use client";

import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { CalculatorFormData } from "../types";
import { HistoryCard } from "./history-card";

interface RecentComparisonsProps {
  hashes: string[];
  onLoadHistory: (data: CalculatorFormData) => void;
}

export function RecentComparisons({
  hashes,
  onLoadHistory,
}: RecentComparisonsProps) {
  if (hashes.length === 0) return null;

  return (
    <m.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-2"
    >
      <p className="text-sm text-slate-400">Comparações recentes:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <AnimatePresence mode="popLayout">
          {hashes.map((hash, index) => (
            <m.div
              key={hash}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <HistoryCard hash={hash} onClick={onLoadHistory} />
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </m.div>
  );
}
