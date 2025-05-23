"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { calculateCLT } from "@/use-cases/calculator/salary-calculations";
import { CLTCalculatorFormData } from "@/use-cases/calculator/types";
import {
  safeParseBoolean,
  safeParseNumberString,
} from "@/use-cases/calculator/utils";
import NumberFlow from "@number-flow/react";
import { ArrowRight, Banknote, Calculator } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback } from "react";
import CltResultsBreakdown from "./components/clt-results-breakdown";

import { CltDataForm } from "@/components/calculators/clt-data-form";
import { BorderBeam } from "@/components/ui/border-beam";
import { ShareButton } from "@/components/ui/share-button";
import {
  DEFAULT_CLT_FORM_DATA,
  REVERSE_CLT_PARAM_MAP,
} from "@/use-cases/calculator/constants";
import { useCalculatorForm } from "@/use-cases/calculator/use-calculator-form";
import { useRouter } from "next/navigation";

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
  const {
    formData,
    setFormData,
    handleClear,
    getParamsAndSaveToHistory,
    history,
    handleShare,
  } = useCalculatorForm({ localStorageKey: "calculator-clt-history" });
  const results = calculateResults(formData);

  const router = useRouter();

  const handleGoToCLT = () => {
    getParamsAndSaveToHistory();
    router.push(`/calculadora-clt-vs-pj`);
  };

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
      <div className="flex md:items-center justify-between md:flex-row flex-col gap-2 md:gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-highlight-text">
            Calculadora de Salário Líquido CLT
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
        renderHistoryItem={renderHistoryItem}
        maxItems={6}
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
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
              <Card className="relative bg-gradient-to-br from-slate-900 to-slate-950">
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
                        value={results.netSalary}
                        format={{
                          style: "currency",
                          currency: "BRL",
                          trailingZeroDisplay: "stripIfInteger",
                        }}
                        data-testid="final-amount"
                        data-testvalue={results.netSalary}
                      />
                    </div>
                    <p className="text-sm text-secondary-text mt-1">
                      Valor que você recebe mensalmente
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-text">
                        Salário Bruto:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(results.grossSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary-text">
                        Total Descontos:
                      </span>
                      <span className="font-medium text-red-400">
                        -
                        {formatCurrency(
                          results.deductions.inss +
                            results.deductions.ir +
                            results.deductions.transportDeduction +
                            results.deductions.otherCltExpenses +
                            results.deductions.alimony
                        )}
                      </span>
                    </div>
                  </div>

                  <ShareButton onShare={handleShare} className="min-w-full" />
                </CardContent>
                <CltResultsBreakdown results={results} />
              </Card>

              {/* CTA Card */}
              <Card className="border border-accent/20 bg-accent/5">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <h3 className="font-semibold text-highlight-text">
                      Quer comparar CLT vs PJ?
                    </h3>
                    <p className="text-sm text-secondary-text">
                      Veja qual é mais vantajoso para você
                    </p>
                    <Button
                      onClick={handleGoToCLT}
                      variant="outline"
                      className="min-w-full"
                    >
                      Comparar CLT vs PJ
                      <ArrowRight className="size-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
    </>
  );
}
