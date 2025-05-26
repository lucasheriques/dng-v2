"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { calculateCLT } from "@/use-cases/calculator/salary-calculations";
import { CLTCalculatorFormData } from "@/use-cases/calculator/types";
import {
  safeParseBoolean,
  safeParseNumberString,
} from "@/use-cases/calculator/utils";
import NumberFlow from "@number-flow/react";
import { Banknote, Calculator, Info } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import CltResultsBreakdown from "./components/clt-results-breakdown";
import { IrpfEducationCard } from "./components/irpf-education-card";

import { CalculatorsPageHeader } from "@/components/calculators/calculators-page-header";
import { CltDataForm } from "@/components/calculators/clt-data-form";
import { CltEmployerCost } from "@/components/calculators/clt-employer-cost";
import { BorderBeam } from "@/components/ui/border-beam";
import { ResponsiveTooltip } from "@/components/ui/responsive-tooltip";
import { ShareButton } from "@/components/ui/share-button";
import {
  DEFAULT_CLT_FORM_DATA,
  REVERSE_CLT_PARAM_MAP,
} from "@/use-cases/calculator/constants";
import { useCalculatorForm } from "@/use-cases/calculator/use-calculator-form";
import Balancer from "react-wrap-balancer";

const RecentComparisons = dynamic(
  () => import("@/app/calculadora-clt-vs-pj/components/recent-comparisons"),
  {
    ssr: false,
  }
);

interface CltSalaryCalculatorProps {
  initialData?: Partial<CLTCalculatorFormData>;
}

const calculateResults = (formData: CLTCalculatorFormData) => {
  if (!formData.grossSalary || Number(formData.grossSalary) <= 0) {
    return null;
  }

  return calculateCLT({
    grossSalary: Number(formData.grossSalary) || 0,
    mealAllowance: Number(formData.mealAllowance) || undefined,
    transportAllowance: Number(formData.transportAllowance) || undefined,
    healthInsurance: Number(formData.healthInsurance) || undefined,
    otherBenefits: Number(formData.otherBenefits) || undefined,
    includeFGTS: formData.includeFGTS,
    yearsAtCompany: Number(formData.yearsAtCompany) || 0,
    plr: Number(formData.plr) || undefined,
    otherCltExpenses: Number(formData.otherCltExpenses) || 0,
    alimony: Number(formData.alimony) || 0,
    dependentsCount: Number(formData.dependentsCount) || 0,
  });
};

export function CltSalaryCalculator({ initialData }: CltSalaryCalculatorProps) {
  const { formData, setFormData, handleClear, history, handleShare, results } =
    useCalculatorForm({ localStorageKey: "calculator-clt-history" });

  const handleLoadHistory = (paramString: string) => {
    const searchParams = new URLSearchParams(paramString);
    const loadedData: CLTCalculatorFormData = { ...DEFAULT_CLT_FORM_DATA };

    for (const shortKey in REVERSE_CLT_PARAM_MAP) {
      const formKey = REVERSE_CLT_PARAM_MAP[shortKey];
      const value = searchParams.get(shortKey);

      if (value !== null) {
        if (formKey === "includeFGTS") {
          loadedData.includeFGTS = safeParseBoolean(
            value,
            DEFAULT_CLT_FORM_DATA.includeFGTS
          );
        } else {
          const stringValue = safeParseNumberString(
            value,
            DEFAULT_CLT_FORM_DATA[formKey] as string
          );
          loadedData[formKey] = stringValue;
        }
      }
    }

    setFormData({ ...formData, ...loadedData });

    const url = new URL(window.location.pathname, window.location.origin);
    url.search = paramString;
    window.history.replaceState({}, "", url.toString());
  };

  const renderHistoryItem = useCallback((paramString: string) => {
    const params = new URLSearchParams(paramString);
    const grossSalary = params.get("gs") || "0";
    const testFormData: CLTCalculatorFormData = {
      ...DEFAULT_CLT_FORM_DATA,
      grossSalary: grossSalary,
    };

    const testResults = calculateResults(testFormData);

    return {
      title: `Bruto: ${formatCurrency(Number(grossSalary))}`,
      subtitle: `Líquido: ${formatCurrency(testResults?.netSalary || 0)}`,
    };
  }, []);

  return (
    <>
      <CalculatorsPageHeader
        title="Calculadora de Salário Líquido CLT"
        handleClear={handleClear}
      />

      <RecentComparisons
        historyItems={history}
        onLoadHistory={handleLoadHistory}
        renderHistoryItem={renderHistoryItem}
        maxItems={6}
      />

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
        {/* Form Section */}
        <div className="lg:col-span-2 md:col-span-1">
          <CltDataForm
            initialData={initialData}
            historyLocalStorageKey="calculator-clt-history"
          />
        </div>

        {/* Results Section */}
        <div>
          {results && (
            <>
              {/* Main Result Card */}
              <Card className="relative bg-gradient-to-br from-slate-900 to-slate-950 overflow-hidden">
                <BorderBeam />
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Banknote className="size-5" />
                    Salário Líquido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">
                      <NumberFlow
                        value={results.clt.netSalary}
                        format={{
                          style: "currency",
                          currency: "BRL",
                          trailingZeroDisplay: "stripIfInteger",
                        }}
                        data-testid="final-amount"
                        data-testvalue={results.clt.netSalary}
                      />
                    </div>
                    <p className="text-sm text-secondary-text mt-1">
                      <Balancer>
                        Valor que você recebe mensalmente (
                        {(
                          (results.clt.netSalary / results.clt.grossSalary) *
                          100
                        ).toFixed(2)}
                        % do salário bruto)
                      </Balancer>
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-text">
                        Salário Bruto:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(results.clt.grossSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-text">Descontos:</span>
                      <span className="font-medium text-red-400">
                        -
                        {formatCurrency(
                          results.clt.deductions.inss +
                            results.clt.deductions.ir +
                            results.clt.deductions.transportDeduction +
                            results.clt.deductions.otherCltExpenses +
                            results.clt.deductions.alimony
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-text flex items-center gap-1">
                        <ResponsiveTooltip
                          trigger={
                            <>
                              <Info size={16} />
                              Total com benefícios:
                            </>
                          }
                        >
                          Inclui 13º salário, 33% férias,{" "}
                          {results?.clt.includeFGTS ? "FGTS" : ""} e todos os
                          outros adicionados
                        </ResponsiveTooltip>
                      </span>
                      <span className="font-medium text-emerald-400">
                        {formatCurrency(results.clt.total)}
                      </span>
                    </div>
                  </div>

                  <ShareButton onShare={handleShare} className="min-w-full" />
                </CardContent>
                <CltResultsBreakdown results={results.clt} />
              </Card>

              {/* CTA Card */}
            </>
          )}

          {!results && (
            <Card className="border border-dashed bg-accent/50">
              <CardContent className="p-8 text-center space-y-3">
                <Calculator className="size-8 mx-auto text-muted-foreground" />
                <h3 className="font-medium text-secondary-text">
                  Insira seu salário bruto
                </h3>
                <p className="text-sm text-tertiary-text">
                  Digite o valor do seu salário bruto para ver o cálculo
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {results && (
        <CltEmployerCost results={results} withPJComparison={false} />
      )}

      {results && (
        <IrpfEducationCard
          grossSalary={results.clt.grossSalary}
          inssDeduction={results.clt.deductions.inss}
          alimony={results.clt.deductions.alimony}
          dependentsCount={Number(formData.dependentsCount) || 0}
          finalIrpf={results.clt.deductions.ir}
        />
      )}
    </>
  );
}
