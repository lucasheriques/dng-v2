"use client";

import {
  ColorTheme,
  FancyCard,
  FancyCardFooter,
  FancyCardTitle,
} from "@/components/ui/fancy-card";
import { formatCurrency } from "@/lib/utils";
import NumberFlow from "@number-flow/react";

interface RetirementIncomeCardProps {
  title: string;
  percentage: number;
  finalAmount: number;
  tooltipContent: string;
  duration: string;
  colorTheme: ColorTheme;
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
      amount: "text-emerald-100",
    },
    blue: {
      amount: "text-blue-100",
    },
  };

  const theme = themeClasses[colorTheme];

  return (
    <FancyCard colorTheme={colorTheme}>
      <FancyCardTitle title={title} tooltip={tooltipContent} />

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

      <FancyCardFooter>
        <p className="text-sm text-tertiary-text">
          Renda anual: {formatCurrency(annualIncome, "BRL")}
        </p>
        <p className="text-xs text-tertiary-text mt-1">{duration}</p>
      </FancyCardFooter>
    </FancyCard>
  );
}
