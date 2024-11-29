"use client";

import { formatCurrency } from "@/lib/utils";
import { TableHeader, TableInput, TableRow } from "../components";

interface InvestmentConfigProps {
  cltMonthlyTotal: number;
  pjMonthlyTotal: number;
  investmentRate: string;
  interestRate: string;
  onInvestmentRateChange: (value: string) => void;
  onInterestRateChange: (value: string) => void;
}

export function InvestmentConfig({
  cltMonthlyTotal,
  pjMonthlyTotal,
  investmentRate,
  interestRate,
  onInvestmentRateChange,
  onInterestRateChange,
}: InvestmentConfigProps) {
  const cltInvestment = (cltMonthlyTotal * Number(investmentRate)) / 100;
  const pjInvestment = (pjMonthlyTotal * Number(investmentRate)) / 100;

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900/50">
      <TableHeader>Configurações de Investimento</TableHeader>
      <TableRow
        label="Taxa de Juros ao Ano"
        tooltipContent="O valor padrão é taxa SELIC."
      >
        <TableInput
          value={interestRate}
          onChange={onInterestRateChange}
          prefix="%"
        />
      </TableRow>
      <TableRow
        label="Percentual do Salário Total"
        tooltipContent="Quanto do salário total será investido mensalmente"
      >
        <TableInput
          value={investmentRate}
          onChange={onInvestmentRateChange}
          prefix="%"
        />
      </TableRow>

      <TableHeader>Valor Mensal Investido</TableHeader>
      <TableRow label="CLT">
        <div className="py-2 px-3 text-right">
          {formatCurrency(cltInvestment)}
        </div>
      </TableRow>
      <TableRow label="PJ">
        <div className="py-2 px-3 text-right">
          {formatCurrency(pjInvestment)}
        </div>
      </TableRow>
    </div>
  );
}
