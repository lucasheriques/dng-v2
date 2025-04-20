import {
  DataForm,
  DataFormHeader,
  DataFormInfoRow,
  DataFormInput,
  DataFormRow,
} from "@/components/data-forms";
import { formatCurrency } from "@/lib/utils";
import { DotIcon } from "lucide-react";

interface InvestmentConfigProps {
  cltMonthlyTotal: number;
  pjMonthlyTotal: number;
  cltInvestmentRate: string;
  pjInvestmentRate: string;
  interestRate: string;
  onCltInvestmentRateChange: (value: string) => void;
  onPjInvestmentRateChange: (value: string) => void;
  onInterestRateChange: (value: string) => void;
  years: string;
  onYearsChange: (value: string) => void;
}

export function InvestmentConfig({
  cltMonthlyTotal,
  pjMonthlyTotal,
  cltInvestmentRate,
  pjInvestmentRate,
  interestRate,
  onCltInvestmentRateChange,
  onPjInvestmentRateChange,
  onInterestRateChange,
  years,
  onYearsChange,
}: InvestmentConfigProps) {
  const cltInvestment = (cltMonthlyTotal * Number(cltInvestmentRate)) / 100;
  const pjInvestment = (pjMonthlyTotal * Number(pjInvestmentRate)) / 100;

  return (
    <DataForm>
      <DataFormHeader>Configurações de Investimento</DataFormHeader>
      <DataFormRow
        label="Taxa de Juros ao Ano"
        tooltipContent="O valor padrão é taxa SELIC."
      >
        <DataFormInput
          value={interestRate}
          onChange={onInterestRateChange}
          prefix="%"
        />
      </DataFormRow>
      <DataFormRow
        label="Percentual do Salário Total CLT"
        tooltipContent="Quanto do salário total CLT será investido mensalmente"
      >
        <DataFormInput
          value={cltInvestmentRate}
          onChange={onCltInvestmentRateChange}
          prefix="%"
        />
      </DataFormRow>
      <DataFormRow
        label="Percentual do Salário Total PJ"
        tooltipContent="Quanto do salário total PJ será investido mensalmente"
      >
        <DataFormInput
          value={pjInvestmentRate}
          onChange={onPjInvestmentRateChange}
          prefix="%"
        />
      </DataFormRow>
      <DataFormRow
        label="Prazo (anos)"
        tooltipContent="Quanto tempo você vai investir"
      >
        <DataFormInput value={years} onChange={onYearsChange} />
      </DataFormRow>

      <DataFormHeader>Valor Mensal Investido</DataFormHeader>
      <DataFormInfoRow
        label="CLT"
        value={
          <div className="flex items-center justify-end">
            <span className="text-emerald-400 font-semibold">
              {formatCurrency(cltInvestment)}
            </span>
            <DotIcon className="size-6" />
            <span className="text-tertiary-text">
              Sobram {formatCurrency(cltMonthlyTotal - cltInvestment)}
            </span>
          </div>
        }
      />
      <DataFormInfoRow
        label="PJ"
        className="lg:last:border-b"
        value={
          <div className="flex items-center justify-end">
            <span className="text-emerald-400 font-semibold">
              {formatCurrency(pjInvestment)}
            </span>
            <DotIcon className="size-6" />
            <span className="text-tertiary-text">
              Sobram {formatCurrency(pjMonthlyTotal - pjInvestment)}
            </span>
          </div>
        }
      />
    </DataForm>
  );
}
