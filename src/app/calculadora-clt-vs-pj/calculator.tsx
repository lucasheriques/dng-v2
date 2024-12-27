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
import { calculateResults } from "@/use-cases/calculator/salary-calculations";
import { Share2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { CalculationResults, CalculatorFormData } from "./types";
import { compress } from "./utils";

const RecentComparisons = dynamic(
  () =>
    import("./components/recent-comparisons").then(
      (mod) => mod.RecentComparisons
    ),
  { ssr: false }
);

interface SalaryCalculatorProps {
  initialData?: CalculatorFormData;
  defaultInterestRate: number;
}

interface CalculatorHistory {
  hashes: string[];
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
  const [history, setHistory] = useLocalStorage<CalculatorHistory>(
    "calculator-history",
    {
      hashes: [],
    }
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
    const hash = compress(formData);

    const newHashes = [hash, ...history.hashes.filter((h) => h !== hash)].slice(
      0,
      3
    );
    setHistory({ hashes: newHashes });

    const url = new URL(window.location.href);
    url.searchParams.set("d", hash);

    window.history.replaceState({}, "", url.toString());

    await navigator.clipboard.writeText(url.toString());

    setShareButtonText("URL copiada!");
    setTimeout(() => {
      setShareButtonText("Compartilhar");
    }, 3000);
  };

  const handleClear = () => {
    setFormData(defaultFormData);
    setResults(null);
    // Remove query param and update URL
    const url = new URL(window.location.href);
    url.searchParams.delete("d");
    window.history.replaceState({}, "", url.toString());
  };

  const handleLoadHistory = (data: CalculatorFormData) => {
    setFormData(data);
    setResults(calculateResults(data));
  };

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
          hashes={history.hashes}
          onLoadHistory={handleLoadHistory}
        />

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900/50">
            <TableHeader>
              <div className="flex justify-between items-center">
                <span>CLT</span>
                <div className="">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="fgts-checkbox"
                      className="text-sm text-slate-300"
                    >
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
