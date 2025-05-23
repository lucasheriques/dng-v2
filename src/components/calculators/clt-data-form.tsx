"use client";

import ResultsAccordion from "@/components/calculators/results-accordion";
import {
  DataForm,
  DataFormHeader,
  DataFormInput,
  DataFormRow,
} from "@/components/data-forms";
import { Checkbox } from "@/components/ui/checkbox";
import { CalculatorFormData } from "@/use-cases/calculator/types";
import { useCalculatorForm } from "@/use-cases/calculator/use-calculator-form";
import { BriefcaseBusiness } from "lucide-react";

interface Props {
  initialData?: Partial<CalculatorFormData>;
  historyLocalStorageKey: string;
  withResultsAccordion?: boolean;
}

export function CltDataForm({
  withResultsAccordion,
  initialData,
  historyLocalStorageKey,
}: Props) {
  const {
    formData,
    handleInputChange,
    handleFGTSChange,
    results,
    isDetailsExpanded,
    setIsDetailsExpanded,
  } = useCalculatorForm({
    localStorageKey: historyLocalStorageKey,
    initialData,
  });

  return (
    <DataForm>
      <DataFormHeader>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            <BriefcaseBusiness className="size-5" />
            Dados CLT
          </span>
          <div className="flex items-center gap-2">
            <label htmlFor="fgts-checkbox" className="text-sm">
              Incluir FGTS
            </label>
            <Checkbox
              id="fgts-checkbox"
              checked={formData.includeFGTS}
              onCheckedChange={handleFGTSChange}
            />
          </div>
        </div>
      </DataFormHeader>
      <DataFormRow label="Salário Bruto Mensal" inputId="gross-salary-input">
        <DataFormInput
          value={formData.grossSalary}
          onChange={(v) =>
            handleInputChange("grossSalary", typeof v === "string" ? v : "")
          }
          prefix="R$"
          id="gross-salary-input"
          autoFocus
        />
      </DataFormRow>

      <DataFormHeader>Benefícios</DataFormHeader>
      <DataFormRow
        label="Vale Refeição/Alimentação"
        inputId="meal-allowance-input"
      >
        <DataFormInput
          value={formData.mealAllowance}
          onChange={(v) =>
            handleInputChange("mealAllowance", typeof v === "string" ? v : "")
          }
          prefix="R$"
          id="meal-allowance-input"
        />
      </DataFormRow>

      <DataFormRow
        label="Vale-Transporte"
        inputId="transport-allowance-input"
        tooltipContent="Desconto máximo de 6% do salário bruto"
      >
        <DataFormInput
          value={formData.transportAllowance}
          onChange={(v) =>
            handleInputChange(
              "transportAllowance",
              typeof v === "string" ? v : ""
            )
          }
          prefix="R$"
          id="transport-allowance-input"
        />
      </DataFormRow>

      <DataFormRow label="Plano de Saúde" inputId="health-insurance-input">
        <DataFormInput
          value={formData.healthInsurance}
          onChange={(v) =>
            handleInputChange("healthInsurance", typeof v === "string" ? v : "")
          }
          prefix="R$"
          id="health-insurance-input"
        />
      </DataFormRow>

      <DataFormRow
        label="PLR Anual"
        tooltipContent="Participação nos Lucros e Resultados (valor bruto anual)"
        inputId="plr-input"
      >
        <DataFormInput
          value={formData.plr}
          onChange={(v) =>
            handleInputChange("plr", typeof v === "string" ? v : "")
          }
          prefix="R$"
          id="plr-input"
        />
      </DataFormRow>

      <DataFormRow
        label="Outros Benefícios"
        tooltipContent="Qualquer benefício não-taxável adicional"
        inputId="other-benefits-input"
      >
        <DataFormInput
          value={formData.otherBenefits}
          onChange={(v) =>
            handleInputChange("otherBenefits", typeof v === "string" ? v : "")
          }
          prefix="R$"
          id="other-benefits-input"
        />
      </DataFormRow>

      <DataFormHeader>Descontos</DataFormHeader>
      <DataFormRow
        label="Pensão Alimentícia"
        tooltipContent="Valor mensal da pensão alimentícia (dedutível do imposto de renda)"
        inputId="pensao-alimenticia-input"
      >
        <DataFormInput
          value={formData.alimony}
          onChange={(v) =>
            handleInputChange("alimony", typeof v === "string" ? v : "")
          }
          prefix="R$"
          id="pensao-alimenticia-input"
        />
      </DataFormRow>
      <DataFormRow
        label="Outros Descontos"
        tooltipContent="Outros descontos mensais em folha (ex: empréstimos, convênios, coparticipação plano de saúde)"
        inputId="other-expenses-input"
      >
        <DataFormInput
          value={formData.otherCltExpenses}
          onChange={(v) =>
            handleInputChange(
              "otherCltExpenses",
              typeof v === "string" ? v : ""
            )
          }
          prefix="R$"
          id="other-expenses-input"
        />
      </DataFormRow>

      <DataFormHeader>Outros Dados</DataFormHeader>
      <DataFormRow
        label="Número de Dependentes"
        inputId="dependents-input"
        tooltipContent="Cada dependente reduz R$ 189,59 do imposto de renda"
      >
        <DataFormInput
          value={formData.dependentsCount}
          onChange={(v) =>
            handleInputChange("dependentsCount", typeof v === "string" ? v : "")
          }
          id="dependents-input"
        />
      </DataFormRow>

      <DataFormRow
        label="Anos na Empresa"
        tooltipContent="Usado para calcular a multa rescisória (FGTS + 40%)"
        inputId="years-input"
      >
        <DataFormInput
          value={formData.yearsAtCompany}
          onChange={(v) =>
            handleInputChange("yearsAtCompany", typeof v === "string" ? v : "")
          }
          id="years-input"
        />
      </DataFormRow>

      {withResultsAccordion && results && (
        <ResultsAccordion
          results={results}
          type="clt"
          isExpanded={isDetailsExpanded}
          onToggle={() => setIsDetailsExpanded(!isDetailsExpanded)}
        />
      )}
    </DataForm>
  );
}
