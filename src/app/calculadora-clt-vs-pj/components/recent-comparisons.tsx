"use client";

import { HistoryCard } from "./history-card";

interface RecentComparisonsProps {
  historyItems: string[];
  onLoadHistory: (paramString: string) => void;
}

export default function RecentComparisons({
  historyItems,
  onLoadHistory,
}: RecentComparisonsProps) {
  if (!historyItems || historyItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-slate-400">Comparações recentes:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {historyItems.slice(0, 3).map((paramString) => (
          <HistoryCard
            key={paramString}
            paramString={paramString}
            onClick={() => onLoadHistory(paramString)}
          />
        ))}
      </div>
    </div>
  );
}
