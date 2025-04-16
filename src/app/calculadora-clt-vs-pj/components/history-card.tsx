import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface HistoryCardProps {
  paramString: string;
  onClick: () => void;
}

const getParamValue = (
  params: URLSearchParams,
  key: string,
  defaultValue: string = ""
): string => {
  return params.get(key) ?? defaultValue;
};

export function HistoryCard({ paramString, onClick }: HistoryCardProps) {
  const params = new URLSearchParams(paramString);

  const cltGrossDisplay = getParamValue(params, "gs", "0");
  const pjGrossDisplay = getParamValue(params, "pjs") || cltGrossDisplay;

  const handleClick = () => {
    onClick();
  };

  return (
    <Button
      variant="outline"
      className="p-4 h-auto flex flex-col items-start gap-1 text-left w-full motion-preset-fade motion-preset-slide-right"
      onClick={handleClick}
    >
      <div className="text-sm font-medium">
        CLT: {formatCurrency(Number(cltGrossDisplay) || 0)}
      </div>
      <div className="text-sm font-medium">
        PJ: {formatCurrency(Number(pjGrossDisplay) || 0)}
      </div>
    </Button>
  );
}
