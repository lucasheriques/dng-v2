import {
  DataForm,
  DataFormHeader,
  DataFormInput,
  DataFormRow,
} from "@/components/data-forms";
import { formatCurrency } from "@/lib/utils";

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
        label="Percentual do Salário Total"
        tooltipContent="Quanto do salário total será investido mensalmente"
      >
        <DataFormInput
          value={investmentRate}
          onChange={onInvestmentRateChange}
          prefix="%"
        />
      </DataFormRow>

      <DataFormHeader>Valor Mensal Investido</DataFormHeader>
      <DataFormRow label="CLT">
        <div className="py-2 px-3 text-right">
          {formatCurrency(cltInvestment)}
        </div>
      </DataFormRow>
      <DataFormRow label="PJ">
        <div className="py-2 px-3 text-right">
          {formatCurrency(pjInvestment)}
        </div>
      </DataFormRow>
    </DataForm>
  );
}
