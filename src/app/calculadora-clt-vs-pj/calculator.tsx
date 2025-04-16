"use client";

import Results from "@/app/calculadora-clt-vs-pj/components/results";
import ResultsAccordion from "@/app/calculadora-clt-vs-pj/components/results-accordion";
import {
  TableHeader,
  TableInput,
  TableRow,
} from "@/app/calculadora-clt-vs-pj/components/table-inputs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils"; // Import formatCurrency
import { calculateResults } from "@/use-cases/calculator/salary-calculations";
import { Share2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { CalculationResults, CalculatorFormData } from "./types";

const RecentComparisons = dynamic(
  () => import("@/app/calculadora-clt-vs-pj/components/recent-comparisons"),
  {
    ssr: false,
  }
);

interface SalaryCalculatorProps {
  initialData?: CalculatorFormData;
  defaultInterestRate: number;
}

const defaultFormData: CalculatorFormData = {
  grossSalary: "",
  pjGrossSalary: "",
  mealAllowance: "",
  transportAllowance: "",
  healthInsurance: "",
  otherBenefits: "",
  includeFGTS: true,
  yearsAtCompany: "",
  accountingFee: "189",
  inssContribution: String(1412 * 0.11),
  taxRate: "10",
  otherExpenses: "",
  taxableBenefits: "",
  nonTaxableBenefits: "",
  plr: "",
};

// Mapping from formData keys to URL short keys
const paramMap: { [K in keyof CalculatorFormData]?: string } = {
  grossSalary: "gs",
  pjGrossSalary: "pjs",
  mealAllowance: "ma",
  transportAllowance: "ta",
  healthInsurance: "hi",
  otherBenefits: "ob",
  includeFGTS: "fgts",
  yearsAtCompany: "yc",
  accountingFee: "af",
  inssContribution: "inss",
  taxRate: "tr",
  otherExpenses: "oe",
  taxableBenefits: "tb",
  nonTaxableBenefits: "nb",
  plr: "plr",
};

// Reverse map needed for loading history
const reverseParamMap: { [key: string]: keyof CalculatorFormData } = {};
for (const key in paramMap) {
  const formKey = key as keyof CalculatorFormData;
  const shortKey = paramMap[formKey];
  if (shortKey) {
    reverseParamMap[shortKey] = formKey;
  }
}

// Helper functions for parsing (needed for loading history)
const safeParseString = (
  value: string | null | undefined,
  defaultValue: string
): string => {
  return typeof value === "string" ? value : defaultValue;
};

const safeParseBoolean = (
  value: string | null | undefined,
  defaultValue: boolean
): boolean => {
  if (typeof value !== "string") return defaultValue;
  return value === "1" ? true : value === "0" ? false : defaultValue;
};

// Helper to get param value, needed for renderHistoryItem
const getParamValue = (
  params: URLSearchParams,
  key: string,
  defaultValue: string = ""
): string => {
  return params.get(key) ?? defaultValue;
};

export function SalaryCalculatorClient({
  initialData,
  defaultInterestRate,
}: SalaryCalculatorProps) {
  const [formData, setFormData] = useState<CalculatorFormData>(
    initialData ?? defaultFormData
  );

  const [results, setResults] = useState<CalculationResults | null>(
    initialData ? calculateResults(initialData) : null
  );
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);
  const [shareButtonText, setShareButtonText] = useState("Compartilhar");

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
      setShareButtonText("URL copiada!");
      setTimeout(() => {
        setShareButtonText("Compartilhar");
      }, 3000);
    } catch (err) {
      console.error("Failed to copy URL: ", err);
      // Add user feedback here if desired (e.g., using a toast notification)
      setShareButtonText("Erro ao copiar");
      setTimeout(() => {
        setShareButtonText("Compartilhar");
      }, 3000);
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
          loadedData.includeFGTS = safeParseBoolean(
            value,
            defaultFormData.includeFGTS
          );
        } else {
          // For all other keys, which are strings in CalculatorFormData
          const stringValue = safeParseString(value, "");
          const defaultValue = defaultFormData[formKey] as string;

          if (stringValue !== "" || defaultValue === "") {
            // Assign string value to the corresponding key in loadedData
            // TypeScript knows formKey corresponds to a string key here because we excluded 'includeFGTS'
            loadedData[formKey] = stringValue;
          } else {
            loadedData[formKey] = defaultValue;
          }
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
  const renderSalaryHistoryItem = useCallback(
    (paramString: string) => {
      const params = new URLSearchParams(paramString);
      const cltGrossDisplay = getParamValue(params, "gs", "0");
      const pjGrossDisplay = getParamValue(params, "pjs") || cltGrossDisplay;
      return {
        title: `CLT: ${formatCurrency(Number(cltGrossDisplay) || 0)}`,
        subtitle: `PJ: ${formatCurrency(Number(pjGrossDisplay) || 0)}`,
      };
    },
    [] // No dependencies needed as it only uses formatCurrency and getParamValue
  );

  return (
    <>
      <div className="grid gap-4">
        <div className="flex md:items-center justify-between md:flex-row flex-col gap-2 md:gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Calculadora CLT vs. PJ</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleClear}
            >
              Limpar valores
            </Button>
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
              {shareButtonText}
            </Button>
          </div>
        </div>

        <RecentComparisons
          historyItems={history}
          onLoadHistory={handleLoadHistory}
          renderHistoryItem={renderSalaryHistoryItem} // Pass the render function
        />

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900/50">
            <TableHeader>
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
            </TableHeader>
            <TableHeader>Salário Base</TableHeader>
            <TableRow label="Salário Bruto Mensal">
              <TableInput
                value={formData.grossSalary}
                onChange={(v) => handleInputChange("grossSalary", v)}
                required
                prefix="R$"
                placeholder={
                  formData.pjGrossSalary === ""
                    ? ""
                    : `${formData.pjGrossSalary}. Clique para alterar.`
                }
              />
            </TableRow>

            <TableHeader>Benefícios</TableHeader>
            <TableRow label="Vale Refeição/Alimentação">
              <TableInput
                value={formData.mealAllowance}
                onChange={(v) => handleInputChange("mealAllowance", v)}
                prefix="R$"
              />
            </TableRow>
            <TableRow label="Vale-Transporte">
              <TableInput
                value={formData.transportAllowance}
                onChange={(v) => handleInputChange("transportAllowance", v)}
                prefix="R$"
              />
            </TableRow>
            <TableRow label="Plano de Saúde">
              <TableInput
                value={formData.healthInsurance}
                onChange={(v) => handleInputChange("healthInsurance", v)}
                prefix="R$"
              />
            </TableRow>
            <TableRow
              label="PLR Anual"
              tooltipContent="Participação nos Lucros e Resultados (valor bruto anual)"
            >
              <TableInput
                value={formData.plr}
                onChange={(v) => handleInputChange("plr", v)}
                prefix="R$"
              />
            </TableRow>
            <TableRow
              label="Outros Benefícios"
              tooltipContent="Qualquer benefício não-taxável que você queira adicionar."
            >
              <TableInput
                value={formData.otherBenefits}
                onChange={(v) => handleInputChange("otherBenefits", v)}
                prefix="R$"
              />
            </TableRow>

            <TableHeader>Outros dados</TableHeader>
            <TableRow
              label="Anos na empresa"
              tooltipContent="Usado para calcular a multa rescisória em caso de demissão sem justa causa."
            >
              <TableInput
                value={formData.yearsAtCompany}
                onChange={(v) => handleInputChange("yearsAtCompany", v)}
              />
            </TableRow>

            {results && (
              <ResultsAccordion
                results={results}
                type="clt"
                isExpanded={isDetailsExpanded}
                onToggle={() => setIsDetailsExpanded(!isDetailsExpanded)}
              />
            )}
          </div>

          <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900/50">
            <TableHeader>PJ</TableHeader>
            <TableHeader>Salário Base</TableHeader>
            <TableRow label="Salário Bruto Mensal">
              <TableInput
                value={formData.pjGrossSalary}
                onChange={(v) => handleInputChange("pjGrossSalary", v)}
                placeholder={
                  formData.grossSalary === ""
                    ? ""
                    : `${formData.grossSalary}. Clique para alterar.`
                }
                prefix="R$"
              />
            </TableRow>

            <TableHeader>Despesas</TableHeader>
            <TableRow
              label="Honorários Contador"
              tooltipContent="Baseado no valor da mensalidade da Contabilizei."
            >
              <TableInput
                value={formData.accountingFee}
                onChange={(v) => handleInputChange("accountingFee", v)}
                prefix="R$"
              />
            </TableRow>
            <TableRow
              label="Contribuição INSS"
              tooltipContent="O valor padrão é 11% do salário mínimo."
            >
              <TableInput
                value={formData.inssContribution}
                onChange={(v) => handleInputChange("inssContribution", v)}
                prefix="R$"
              />
            </TableRow>
            <TableRow
              label="Alíquota de Impostos (%)"
              tooltipContent={
                "PJ tem muitos cenários que não são cobertos aqui. Simplifiquei de forma que você mesmo pode o valor que faz sentido pra você."
              }
            >
              <TableInput
                value={formData.taxRate}
                onChange={(v) => handleInputChange("taxRate", v)}
                prefix="%"
              />
            </TableRow>
            <TableRow label="Outras Despesas">
              <TableInput
                value={formData.otherExpenses}
                onChange={(v) => handleInputChange("otherExpenses", v)}
                prefix="R$"
              />
            </TableRow>

            <TableHeader>Benefícios</TableHeader>
            <TableRow
              label="Benefícios Tributáveis"
              tooltipContent="Benefícios que são somados ao salário bruto para fins de tributação"
            >
              <TableInput
                value={formData.taxableBenefits}
                onChange={(v) => handleInputChange("taxableBenefits", v)}
                prefix="R$"
              />
            </TableRow>
            <TableRow
              label="Benefícios Não-Tributáveis"
              tooltipContent="Benefícios que você recebe mas não são tributados"
            >
              <TableInput
                value={formData.nonTaxableBenefits}
                onChange={(v) => handleInputChange("nonTaxableBenefits", v)}
                prefix="R$"
              />
            </TableRow>

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
          <Results
            defaultInterestRate={defaultInterestRate}
            results={results}
            formData={formData}
          />
        )}
      </div>
    </>
  );
}
