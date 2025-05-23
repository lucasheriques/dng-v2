"use client";

import { formatCurrency } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../components/ui/tooltip";

interface RetirementIncomeCardProps {
  title: string;
  percentage: number;
  finalAmount: number;
  tooltipContent: string;
  duration: string;
  colorTheme: "emerald" | "blue";
}

export function RetirementIncomeCard({
  title,
  percentage,
  finalAmount,
  tooltipContent,
  duration,
  colorTheme,
}: RetirementIncomeCardProps) {
  const monthlyIncome = (finalAmount * (percentage / 100)) / 12;
  const annualIncome = finalAmount * (percentage / 100);

  const themeClasses = {
    emerald: {
      background: "bg-gradient-to-br from-emerald-500/10 to-emerald-600/5",
      border: "border-emerald-500/20",
      icon: "text-emerald-400",
      title: "text-emerald-100",
      amount: "text-emerald-100",
      borderTop: "border-emerald-500/20",
      dot: "bg-emerald-400",
    },
    blue: {
      background: "bg-gradient-to-br from-blue-500/10 to-blue-600/5",
      border: "border-blue-500/20",
      icon: "text-blue-400",
      title: "text-blue-100",
      amount: "text-blue-100",
      borderTop: "border-blue-500/20",
      dot: "bg-blue-400",
    },
  };

  const theme = themeClasses[colorTheme];

  return (
    <div
      className={`relative rounded-lg ${theme.background} border ${theme.border} p-6`}
    >
      <div className="absolute top-4 right-4">
        <>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger className="hidden lg:block">
                <Info className={`w-5 h-5 ${theme.icon} cursor-help`} />
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px]">
                {tooltipContent}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Popover>
            <PopoverTrigger className="block lg:hidden">
              <Info className={`w-5 h-5 ${theme.icon} cursor-help`} />
            </PopoverTrigger>
            <PopoverContent className="text-sm">
              {tooltipContent}
            </PopoverContent>
          </Popover>
        </>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${theme.dot}`}></div>
          <h3 className={`font-semibold text-lg ${theme.title}`}>{title}</h3>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-tertiary-text mb-1">Renda mensal</p>
            <p className={`text-3xl font-bold ${theme.amount}`}>
              <NumberFlow
                value={monthlyIncome}
                format={{
                  style: "currency",
                  currency: "BRL",
                  trailingZeroDisplay: "stripIfInteger",
                }}
              />
            </p>
          </div>

          <div className={`pt-3 border-t ${theme.borderTop}`}>
            <p className="text-sm text-tertiary-text">
              Renda anual: {formatCurrency(annualIncome, "BRL")}
            </p>
            <p className="text-xs text-tertiary-text mt-1">{duration}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
