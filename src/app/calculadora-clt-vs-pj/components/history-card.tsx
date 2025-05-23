import { Button } from "@/components/ui/button";

interface HistoryCardProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}

export function HistoryCard({ title, subtitle, onClick }: HistoryCardProps) {
  const handleClick = () => {
    onClick();
  };

  return (
    <Button
      variant="outline"
      className="p-4 h-auto flex flex-col items-start gap-1 text-left w-full motion-preset-fade motion-preset-slide-right overflow-hidden"
      onClick={handleClick}
    >
      <div className="text-sm font-medium truncate max-w-full">{title}</div>
      <div className="text-sm font-medium truncate max-w-full">{subtitle}</div>
    </Button>
  );
}
