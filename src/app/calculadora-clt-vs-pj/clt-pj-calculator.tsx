"use client";

import Results from "@/app/calculadora-clt-vs-pj/components/results";
import ResultsAccordion from "@/app/calculadora-clt-vs-pj/components/results-accordion";
import {
  DataFormHeader,
  DataFormInput,
  DataFormRow,
} from "@/components/data-forms";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils"; // Import formatCurrency
import { calculateResults } from "@/use-cases/calculator/salary-calculations";
import { CalculatorFormData } from "@/use-cases/calculator/types";
import { buildUrlParameters } from "@/use-cases/calculator/utils";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { CltDataForm } from "@/components/calculators/clt-data-form";
import {
  formDataAtom,
  parseQueryParamsToFormData,
} from "@/use-cases/calculator/client-state";
import { useAtom } from "jotai";
import { useResetAtom } from "jotai/react/utils";
import { Building2 } from "lucide-react";

const RecentComparisons = dynamic(
  () => import("@/app/calculadora-clt-vs-pj/components/recent-comparisons"),
  {
    ssr: false,
  }
);

interface SalaryCalculatorProps {
  initialData: Partial<CalculatorFormData>;
}

// Helper to get param value, needed for renderHistoryItem
const getParamValue = (
  params: URLSearchParams,
  key: string,
  defaultValue: string = ""
): string => {
  return params.get(key) ?? defaultValue;
};

export function CltPjCalculator({ initialData }: SalaryCalculatorProps) {
  const [formData, setFormData] = useAtom(formDataAtom);
  const resetFormData = useResetAtom(formDataAtom);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      setFormData({ ...formData, ...initialData });
    }
  }, [initialData]);

  const results = calculateResults(formData);

  // Use localStorage to store an array of parameter strings
  const [history, setHistory] = useLocalStorage<string[]>(
    "calculator-clt-pj-history",
    []
  );

  const handleFGTSChange = (value: boolean) => {
    const newFormData = {
      ...formData,
      includeFGTS: value,
    };
    setFormData(newFormData);
  };

  const handleInputChange = (
    field: keyof CalculatorFormData,
    value: string
  ) => {
    const newFormData = {
      ...formData,
      [field]: value,
    };

    setFormData(newFormData);
  };

  const handleShare = async () => {
    const paramString = buildUrlParameters(formData).toString();
    const url = new URL(window.location.pathname, window.location.origin);
    url.search = paramString;

    // Update history in localStorage
    const newHistory = [
      paramString,
      ...history.filter((h) => h !== paramString), // Remove duplicates
    ].slice(0, 7); // Keep last 7 entries
    setHistory(newHistory);

    window.history.replaceState({}, "", url.toString());

    try {
      await navigator.clipboard.writeText(url.toString());
      return true;
    } catch (err) {
      console.error("Failed to copy URL: ", err);
      return false;
    }
  };

  const handleClear = () => {
    resetFormData();
    // Remove query params and update URL
    const url = new URL(window.location.pathname, window.location.origin); // Use pathname and origin
    url.search = ""; // Clear search params
    window.history.replaceState({}, "", url.toString());
  };

  // Re-add handleLoadHistory - takes the param string
  const handleLoadHistory = (paramString: string) => {
    const searchParams = new URLSearchParams(paramString);
    setFormData(parseQueryParamsToFormData(searchParams));
    const url = new URL(window.location.pathname, window.location.origin);
    url.search = paramString;
    window.history.replaceState({}, "", url.toString());
  };

  // Function to render history items for Salary Calculator
  const renderSalaryHistoryItem = useCallback((paramString: string) => {
    const params = new URLSearchParams(paramString);
    const cltGrossDisplay = getParamValue(params, "gs", "0");
    const pjGrossDisplay = getParamValue(params, "pjs") || cltGrossDisplay;
    return {
      title: `CLT: ${formatCurrency(Number(cltGrossDisplay) || 0)}`,
      subtitle: `PJ: ${formatCurrency(Number(pjGrossDisplay) || 0)}`,
    };
  }, []);

  return (
    <div className="grid gap-4">
      <div className="flex md:items-center justify-between md:flex-row flex-col gap-2 md:gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-highlight-text">
            Calculadora CLT vs. PJ
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => {
              const hyvorTalkContainer =
                document.querySelector("#hyvor-comments");
              hyvorTalkContainer?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Deixar feedback
          </Button>
          <Button variant="ghost" onClick={handleClear}>
            Limpar valores
          </Button>
        </div>
      </div>

      <RecentComparisons
        historyItems={history}
        onLoadHistory={handleLoadHistory}
        renderHistoryItem={renderSalaryHistoryItem} // Pass the render function
      />

      <div className="grid md:grid-cols-2 gap-8">
        <CltDataForm
          initialData={initialData}
          historyLocalStorageKey="calculator-clt-pj-history"
          withResultsAccordion
          onToggle={() => setIsDetailsExpanded(!isDetailsExpanded)}
          isExpanded={isDetailsExpanded}
        />

        <div className="border  rounded-lg overflow-hidden bg-slate-900/50">
          <DataFormHeader>
            <span className="flex items-center gap-2">
              <Building2 className="size-5" />
              Dados PJ
            </span>
          </DataFormHeader>
          <DataFormRow
            label="Salário Bruto Mensal"
            inputId="pj-gross-salary-input"
          >
            <DataFormInput
              value={formData.pjGrossSalary}
              onChange={(v) =>
                handleInputChange(
                  "pjGrossSalary",
                  typeof v === "string" ? v : ""
                )
              }
              placeholder={
                formData.grossSalary === ""
                  ? ""
                  : `${formData.grossSalary}. Clique para alterar.`
              }
              prefix="R$"
              id="pj-gross-salary-input"
            />
          </DataFormRow>

          <DataFormHeader>Despesas</DataFormHeader>
          <DataFormRow
            label="Honorários Contador"
            tooltipContent="Baseado no valor da mensalidade da Contabilizei."
            inputId="accounting-fee-input"
          >
            <DataFormInput
              value={formData.accountingFee}
              onChange={(v) =>
                handleInputChange(
                  "accountingFee",
                  typeof v === "string" ? v : ""
                )
              }
              prefix="R$"
              id="accounting-fee-input"
            />
          </DataFormRow>
          <DataFormRow
            label="Contribuição INSS"
            tooltipContent="O valor padrão é 11% do salário mínimo."
            inputId="inss-contribution-input"
          >
            <DataFormInput
              value={formData.inssContribution}
              onChange={(v) =>
                handleInputChange(
                  "inssContribution",
                  typeof v === "string" ? v : ""
                )
              }
              prefix="R$"
              id="inss-contribution-input"
            />
          </DataFormRow>
          <DataFormRow
            label="Alíquota de Impostos (%)"
            tooltipContent={
              "10% (valor padrão) é uma estimativa para receita anual menor que R$180k, com o pró-labore acima de 28% do faturamento para redução dos impostos. Para quem trabalha pro exterior, esse valor pode ser ainda menor."
            }
            inputId="tax-rate-input"
          >
            <DataFormInput
              value={formData.taxRate}
              onChange={(v) =>
                handleInputChange("taxRate", typeof v === "string" ? v : "")
              }
              prefix="%"
              id="tax-rate-input"
            />
          </DataFormRow>
          <DataFormRow label="Outras Despesas" inputId="other-expenses-input">
            <DataFormInput
              value={formData.otherExpenses}
              onChange={(v) =>
                handleInputChange(
                  "otherExpenses",
                  typeof v === "string" ? v : ""
                )
              }
              prefix="R$"
              id="other-expenses-input"
            />
          </DataFormRow>

          <DataFormHeader>Benefícios</DataFormHeader>
          <DataFormRow
            label="Benefícios Tributáveis"
            tooltipContent="Benefícios que são somados ao salário bruto para fins de tributação"
            inputId="taxable-benefits-input"
          >
            <DataFormInput
              value={formData.taxableBenefits}
              onChange={(v) =>
                handleInputChange(
                  "taxableBenefits",
                  typeof v === "string" ? v : ""
                )
              }
              prefix="R$"
              id="taxable-benefits-input"
            />
          </DataFormRow>
          <DataFormRow
            label="Benefícios Não-Tributáveis"
            tooltipContent="Benefícios que você recebe mas não são tributados"
            inputId="non-taxable-benefits-input"
          >
            <DataFormInput
              value={formData.nonTaxableBenefits}
              onChange={(v) =>
                handleInputChange(
                  "nonTaxableBenefits",
                  typeof v === "string" ? v : ""
                )
              }
              prefix="R$"
              id="non-taxable-benefits-input"
            />
          </DataFormRow>

          {results && (
            <ResultsAccordion
              results={results}
              type="pj"
              isExpanded={isDetailsExpanded}
              onToggle={() => setIsDetailsExpanded(!isDetailsExpanded)}
            />
          )}
        </div>
      </div>

      {results && (
        <Results results={results} formData={formData} onShare={handleShare} />
      )}
    </div>
  );
}
