"use client";

import Results from "@/app/calculadora-clt-vs-pj/components/results";
import ResultsAccordion from "@/app/calculadora-clt-vs-pj/components/results-accordion";
import {
  DataForm,
  DataFormHeader,
  DataFormInput,
  DataFormRow,
} from "@/components/data-forms";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils"; // Import formatCurrency
import { calculateResults } from "@/use-cases/calculator/salary-calculations";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import {
  CalculationResults,
  CalculatorFormData,
  defaultFormData,
  paramMap,
  reverseParamMap,
  safeParseBoolean,
  safeParseNumberString,
} from "./types";

const RecentComparisons = dynamic(
  () => import("@/app/calculadora-clt-vs-pj/components/recent-comparisons"),
  {
    ssr: false,
  }
);

interface SalaryCalculatorProps {
  initialData?: CalculatorFormData;
}

// Helper to get param value, needed for renderHistoryItem
const getParamValue = (
  params: URLSearchParams,
  key: string,
  defaultValue: string = ""
): string => {
  return params.get(key) ?? defaultValue;
};

export function SalaryCalculatorClient({ initialData }: SalaryCalculatorProps) {
  const [formData, setFormData] = useState<CalculatorFormData>(
    initialData ?? defaultFormData
  );

  const [results, setResults] = useState<CalculationResults | null>(
    initialData ? calculateResults(initialData) : null
  );
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);

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
    setResults(calculateResults(newFormData));
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
    setResults(calculateResults(newFormData));
  };

  const { toast } = useToast();

  const handleShare = async () => {
    const params = new URLSearchParams();

    // Iterate over formData and add non-default values to params
    for (const key in formData) {
      const formKey = key as keyof CalculatorFormData;
      const shortKey = paramMap[formKey];
      const value = formData[formKey];
      const defaultValue = defaultFormData[formKey];

      if (shortKey && value !== defaultValue) {
        if (typeof value === "boolean") {
          params.set(shortKey, value ? "1" : "0");
        } else if (value !== "") {
          // Only add non-empty strings
          params.set(shortKey, String(value));
        }
      }
    }

    const paramString = params.toString();
    const url = new URL(window.location.pathname, window.location.origin);
    url.search = paramString;

    // Update history in localStorage
    const newHistory = [
      paramString,
      ...history.filter((h) => h !== paramString), // Remove duplicates
    ].slice(0, 5); // Keep last 5 entries
    setHistory(newHistory);

    window.history.replaceState({}, "", url.toString());

    try {
      await navigator.clipboard.writeText(url.toString());
      toast({
        title: "Link de compartilhamento copiado!",
        description:
          "O link com a sua simulação foi copiado para a área de transferência.",
      });
    } catch (err) {
      console.error("Failed to copy URL: ", err);
      toast({
        title: "Erro ao copiar link",
        description: "Por favor, tente copiar manualmente.",
      });
    }
  };

  const handleClear = () => {
    setFormData(defaultFormData);
    setResults(null);
    // Remove query params and update URL
    const url = new URL(window.location.pathname, window.location.origin); // Use pathname and origin
    url.search = ""; // Clear search params
    window.history.replaceState({}, "", url.toString());
  };

  // Re-add handleLoadHistory - takes the param string
  const handleLoadHistory = (paramString: string) => {
    const searchParams = new URLSearchParams(paramString);
    const loadedData: CalculatorFormData = { ...defaultFormData };

    for (const shortKey in reverseParamMap) {
      const formKey = reverseParamMap[shortKey];
      const value = searchParams.get(shortKey);

      if (value !== null) {
        if (formKey === "includeFGTS") {
          // Use imported helper
          loadedData.includeFGTS = safeParseBoolean(
            value,
            defaultFormData.includeFGTS
          );
        } else {
          // Use imported helper
          const stringValue = safeParseNumberString(
            value,
            defaultFormData[formKey] as string
          );
          loadedData[formKey] = stringValue;
        }
      }
      // No else needed: if value is null, the default from the initial spread is kept.
    }

    setFormData(loadedData);
    // Ensure calculateResults handles potential invalid number strings gracefully
    const calculated = calculateResults(loadedData);
    if (calculated) {
      // Check if calculation was successful
      setResults(calculated);
    } else {
      // Handle case where calculation fails (e.g., show error, reset results)
      setResults(null);
      console.error("Calculation failed with loaded history data:", loadedData);
    }

    // Also update the URL bar to reflect the loaded state
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
          <h1 className="text-4xl font-bold text-highlight-text">
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
        <DataForm>
          <DataFormHeader>
            <div className="flex justify-between items-center">
              <span>CLT</span>
              <div className="">
                <div className="flex items-center gap-2">
                  <label htmlFor="fgts-checkbox" className="text-sm">
                    Incluir FGTS
                  </label>
                  <Checkbox
                    id="fgts-checkbox"
                    className="p-0"
                    checked={formData.includeFGTS}
                    onCheckedChange={handleFGTSChange}
                  />
                </div>
              </div>
            </div>
          </DataFormHeader>
          <DataFormHeader>Salário Base</DataFormHeader>
          <DataFormRow
            label="Salário Bruto Mensal"
            inputId="gross-salary-input"
          >
            <DataFormInput
              value={formData.grossSalary}
              onChange={(v) =>
                handleInputChange("grossSalary", typeof v === "string" ? v : "")
              }
              required
              prefix="R$"
              placeholder={
                formData.pjGrossSalary === ""
                  ? ""
                  : `${formData.pjGrossSalary}. Clique para alterar.`
              }
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
                handleInputChange(
                  "mealAllowance",
                  typeof v === "string" ? v : ""
                )
              }
              prefix="R$"
              id="meal-allowance-input"
            />
          </DataFormRow>
          <DataFormRow
            label="Vale-Transporte"
            inputId="transport-allowance-input"
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
                handleInputChange(
                  "healthInsurance",
                  typeof v === "string" ? v : ""
                )
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
            tooltipContent="Qualquer benefício não-taxável que você queira adicionar."
            inputId="other-benefits-input"
          >
            <DataFormInput
              value={formData.otherBenefits}
              onChange={(v) =>
                handleInputChange(
                  "otherBenefits",
                  typeof v === "string" ? v : ""
                )
              }
              prefix="R$"
              id="other-benefits-input"
            />
          </DataFormRow>
          <DataFormHeader>Outros dados</DataFormHeader>
          <DataFormRow
            label="Outras despesas"
            tooltipContent="Qualquer despesa mensal em folha de pagamento que você queira adicionar (ex: coparticipação plano de saúde, etc)."
            inputId="other-clt-expenses-input"
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
              id="other-clt-expenses-input"
            />
          </DataFormRow>

          <DataFormRow
            label="Anos na empresa"
            tooltipContent="Usado para calcular a multa rescisória em caso de demissão sem justa causa."
            inputId="years-at-company-input"
          >
            <DataFormInput
              value={formData.yearsAtCompany}
              onChange={(v) =>
                handleInputChange(
                  "yearsAtCompany",
                  typeof v === "string" ? v : ""
                )
              }
              id="years-at-company-input"
            />
          </DataFormRow>

          {results && (
            <ResultsAccordion
              results={results}
              type="clt"
              isExpanded={isDetailsExpanded}
              onToggle={() => setIsDetailsExpanded(!isDetailsExpanded)}
            />
          )}
        </DataForm>

        <div className="border  rounded-lg overflow-hidden bg-slate-900/50">
          <DataFormHeader>PJ</DataFormHeader>
          <DataFormHeader>Salário Base</DataFormHeader>
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
