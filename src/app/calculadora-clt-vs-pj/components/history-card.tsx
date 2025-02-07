import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { calculateResults } from "@/use-cases/calculator/salary-calculations";
import * as m from "motion/react-m";
import { CalculatorFormData } from "../types";
import { decompress } from "../utils";

interface HistoryCardProps {
  hash: string;
  onClick: (data: CalculatorFormData) => void;
}

export function HistoryCard({ hash, onClick }: HistoryCardProps) {
  const formData = decompress(hash);
  const results = calculateResults(formData);

  if (!results) return null;

  const handleClick = () => {
    onClick(formData);
  };

  const cltGrossSalary = Number(formData.grossSalary);
  const pjGrossSalary = Number(formData.pjGrossSalary || formData.grossSalary);

  const cltTotalCompensation = results.clt.total;
  const pjTotalCompensation = results.pj.total;

  return (
    <m.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        variant="outline"
        className="p-4 h-auto flex flex-col items-start gap-1 text-left w-full"
        onClick={handleClick}
      >
        <div className="text-sm font-medium">
          CLT: {formatCurrency(cltGrossSalary)} →{" "}
          {formatCurrency(cltTotalCompensation)}
        </div>
        <div className="text-sm font-medium">
          PJ: {formatCurrency(pjGrossSalary)} →{" "}
          {formatCurrency(pjTotalCompensation)}
        </div>
      </Button>
    </m.div>
  );
}
