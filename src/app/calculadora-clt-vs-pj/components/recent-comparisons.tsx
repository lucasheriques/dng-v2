"use client";

import { HistoryCard } from "./history-card";

interface RecentComparisonsProps {
  historyItems: string[];
  onLoadHistory: (paramString: string) => void;
  renderHistoryItem: (paramString: string) => {
    title: string;
    subtitle: string;
  };
}

export default function RecentComparisons({
  historyItems,
  onLoadHistory,
  renderHistoryItem,
}: RecentComparisonsProps) {
  if (!historyItems || historyItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-slate-400">Comparações recentes:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {historyItems.slice(0, 3).map((paramString) => {
          const { title, subtitle } = renderHistoryItem(paramString);
          return (
            <HistoryCard
              key={paramString}
              title={title}
              subtitle={subtitle}
              onClick={() => onLoadHistory(paramString)}
            />
          );
        })}
      </div>
    </div>
  );
}
