"use client";

import { cn } from "@/lib/utils";
import { HistoryCard } from "./history-card";

interface RecentComparisonsProps {
  historyItems: string[];
  onLoadHistory: (paramString: string) => void;
  renderHistoryItem: (paramString: string) => {
    title: string;
    subtitle: string;
  };
  containerClassName?: string;
  maxItems?: number;
}

export default function RecentComparisons({
  historyItems,
  onLoadHistory,
  renderHistoryItem,
  containerClassName,
  maxItems = 3,
}: RecentComparisonsProps) {
  if (!historyItems || historyItems.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-secondary-text">Comparações recentes:</p>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-3 gap-2",
          containerClassName
        )}
      >
        {historyItems.slice(0, maxItems).map((paramString) => {
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
