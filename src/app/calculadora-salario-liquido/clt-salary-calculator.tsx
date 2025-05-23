"use client";

import {
  DataForm,
  DataFormHeader,
  DataFormInput,
  DataFormRow,
} from "@/components/data-forms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import {
  calculateCLT,
  CLTResults,
} from "@/use-cases/calculator/salary-calculations";
import { CLTCalculatorFormData } from "@/use-cases/calculator/types";
import {
  safeParseBoolean,
  safeParseNumberString,
} from "@/use-cases/calculator/utils";
import NumberFlow from "@number-flow/react";
import { ArrowRight, Banknote, Calculator, Share2 } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import CltResultsBreakdown from "./components/clt-results-breakdown";

import {
  DEFAULT_CLT_FORM_DATA,
  PARAMETERS_MAP,
  REVERSE_CLT_PARAM_MAP,
} from "@/use-cases/calculator/constants";

const RecentComparisons = dynamic(
  () => import("@/app/calculadora-clt-vs-pj/components/recent-comparisons"),
  {
    ssr: false,
  }
);

interface CltSalaryCalculatorProps {
  initialData?: CLTCalculatorFormData;
}

export function CltSalaryCalculator({ initialData }: CltSalaryCalculatorProps) {
  const [formData, setFormData] = useState<CLTCalculatorFormData>(
    initialData ?? DEFAULT_CLT_FORM_DATA
  );

  const [results, setResults] = useState<CLTResults | null>(() => {
    if (initialData && initialData.grossSalary) {
      return calculateCLT({
        grossSalary: Number(initialData.grossSalary) || 0,
        mealAllowance: Number(initialData.mealAllowance) || undefined,
        transportAllowance: Number(initialData.transportAllowance) || undefined,
        healthInsurance: Number(initialData.healthInsurance) || undefined,
        otherBenefits: Number(initialData.otherBenefits) || undefined,
        includeFGTS: initialData.includeFGTS,
        yearsAtCompany: Number(initialData.yearsAtCompany) || 0,
        plr: Number(initialData.plr) || undefined,
        otherCltExpenses: Number(initialData.otherCltExpenses) || 0,
        dependentsCount: Number(initialData.dependentsCount) || 0,
      });
    }
    return null;
  });

  const [history, setHistory] = useLocalStorage<string[]>(
    "calculator-clt-history",
    []
  );

  const { toast } = useToast();

  const calculateResults = useCallback((formData: CLTCalculatorFormData) => {
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
      dependentsCount: Number(formData.dependentsCount) || 0,
    });
  }, []);

  const handleFGTSChange = (value: boolean) => {
    const newFormData = {
      ...formData,
      includeFGTS: value,
    };
    setFormData(newFormData);
    setResults(calculateResults(newFormData));
  };

  const handleInputChange = (
    field: keyof CLTCalculatorFormData,
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

    for (const key in formData) {
      const formKey = key as keyof CLTCalculatorFormData;
      const shortKey = PARAMETERS_MAP[formKey];
      const value = formData[formKey];
      const defaultValue = DEFAULT_CLT_FORM_DATA[formKey];

      if (shortKey && value !== defaultValue) {
        if (typeof value === "boolean") {
          params.set(shortKey, value ? "1" : "0");
        } else if (value !== "") {
          params.set(shortKey, String(value));
        }
      }
    }

    const paramString = params.toString();
    const url = new URL(window.location.pathname, window.location.origin);
    url.search = paramString;

    const newHistory = [
      paramString,
      ...history.filter((h) => h !== paramString),
    ].slice(0, 5);
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
    setFormData(DEFAULT_CLT_FORM_DATA);
    setResults(null);
    const url = new URL(window.location.pathname, window.location.origin);
    url.search = "";
    window.history.replaceState({}, "", url.toString());
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

    setFormData(loadedData);
    const calculated = calculateResults(loadedData);
    setResults(calculated);

    const url = new URL(window.location.pathname, window.location.origin);
    url.search = paramString;
    window.history.replaceState({}, "", url.toString());
  };

  const renderHistoryItem = useCallback((paramString: string) => {
    const params = new URLSearchParams(paramString);
    const grossSalary = params.get("gs") || "0";
    const includeFGTS = params.get("fgts") === "1";

    return {
      title: `Salário: ${formatCurrency(Number(grossSalary))}`,
      subtitle: `FGTS: ${includeFGTS ? "Incluído" : "Não incluído"}`,
    };
  }, []);

  return (
    <div className="grid gap-6">
      <div className="flex md:items-center justify-between md:flex-row flex-col gap-2 md:gap-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-highlight-text">
            Calculadora de Salário Líquido CLT
          </h1>
          <p className="text-lg text-secondary-text">
            Calcule quanto você receberá mensalmente com todos os descontos e
            benefícios incluídos
          </p>
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
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <DataForm>
            <DataFormHeader>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Calculator className="size-5" />
                  Dados do Salário
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

            <DataFormHeader>Salário Base</DataFormHeader>
            <DataFormRow
              label="Salário Bruto Mensal"
              inputId="gross-salary-input"
            >
              <DataFormInput
                value={formData.grossSalary}
                onChange={(v) =>
                  handleInputChange(
                    "grossSalary",
                    typeof v === "string" ? v : ""
                  )
                }
                prefix="R$"
                placeholder="Ex: 5000"
                id="gross-salary-input"
                autoFocus
              />
            </DataFormRow>

            <DataFormRow
              label="Número de Dependentes"
              inputId="dependents-input"
              tooltipContent="Cada dependente reduz R$ 189,59 do imposto de renda"
            >
              <DataFormInput
                value={formData.dependentsCount}
                onChange={(v) =>
                  handleInputChange(
                    "dependentsCount",
                    typeof v === "string" ? v : ""
                  )
                }
                placeholder="0"
                id="dependents-input"
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
                placeholder="Ex: 600"
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
                placeholder="Ex: 200"
                id="transport-allowance-input"
              />
            </DataFormRow>

            <DataFormRow
              label="Plano de Saúde"
              inputId="health-insurance-input"
            >
              <DataFormInput
                value={formData.healthInsurance}
                onChange={(v) =>
                  handleInputChange(
                    "healthInsurance",
                    typeof v === "string" ? v : ""
                  )
                }
                prefix="R$"
                placeholder="Ex: 300"
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
                placeholder="Ex: 5000"
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
                  handleInputChange(
                    "otherBenefits",
                    typeof v === "string" ? v : ""
                  )
                }
                prefix="R$"
                placeholder="Ex: 150"
                id="other-benefits-input"
              />
            </DataFormRow>

            <DataFormHeader>Outros Dados</DataFormHeader>
            <DataFormRow
              label="Outras Despesas"
              tooltipContent="Despesas mensais descontadas em folha (ex: coparticipação plano de saúde)"
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
                placeholder="Ex: 50"
                id="other-expenses-input"
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
                  handleInputChange(
                    "yearsAtCompany",
                    typeof v === "string" ? v : ""
                  )
                }
                placeholder="Ex: 2"
                id="years-input"
              />
            </DataFormRow>
          </DataForm>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          {results && (
            <>
              {/* Main Result Card */}
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-slate-900 to-slate-950">
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
                        data-testvalue={results.total}
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
                            results.deductions.otherCltExpenses
                        )}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleShare}
                    className="w-full"
                    variant="outline"
                  >
                    <Share2 className="size-4 mr-2" />
                    Compartilhar Resultado
                  </Button>
                </CardContent>
              </Card>

              {/* CTA Card */}
              <Card className="border border-accent/20 bg-accent/5">
                <CardContent className="p-4">
                  <div className="text-center space-y-3">
                    <h3 className="font-semibold text-highlight-text">
                      Quer comparar CLT vs PJ?
                    </h3>
                    <p className="text-sm text-secondary-text">
                      Veja qual regime trabalhista é mais vantajoso para você
                    </p>
                    <Link
                      href={`/calculadora-clt-vs-pj?gs=${formData.grossSalary}`}
                      className="block"
                    >
                      <Button variant="default" className="w-full">
                        Comparar CLT vs PJ
                        <ArrowRight className="size-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Breakdown */}
              <CltResultsBreakdown results={results} />
            </>
          )}

          {!results && (
            <Card className="border border-dashed border-border">
              <CardContent className="p-8 text-center space-y-3">
                <Calculator className="size-8 mx-auto text-muted-foreground" />
                <h3 className="font-medium text-muted-foreground">
                  Insira seu salário bruto
                </h3>
                <p className="text-sm text-secondary-text">
                  Digite o valor do seu salário bruto para ver o cálculo
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
