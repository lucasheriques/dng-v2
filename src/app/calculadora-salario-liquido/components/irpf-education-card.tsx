"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { IRRF_RANGES } from "@/use-cases/calculator/salary-calculations";
import NumberFlow from "@number-flow/react";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";

interface IrpfEducationCardProps {
  grossSalary: number;
  inssDeduction: number;
  alimony: number;
  dependentsCount: number;
  finalIrpf: number;
}

const DEPENDENT_DEDUCTION = 189.59;

export function IrpfEducationCard({
  grossSalary,
  inssDeduction,
  alimony,
  dependentsCount,
  finalIrpf,
}: IrpfEducationCardProps) {
  const taxableBase = grossSalary - inssDeduction - alimony;
  const dependentDeduction = dependentsCount * DEPENDENT_DEDUCTION;
  const adjustedBase = Math.max(0, taxableBase - dependentDeduction);

  // Calculate which bracket the salary falls into and breakdown
  const calculateBracketBreakdown = () => {
    const breakdown = [];
    let remainingAmount = adjustedBase;
    let previousMax = 0;

    for (const bracket of IRRF_RANGES) {
      if (remainingAmount <= 0) break;

      const bracketMin = previousMax;
      const bracketMax =
        bracket.max === Infinity
          ? adjustedBase
          : Math.min(bracket.max, adjustedBase);
      const amountInBracket = Math.max(
        0,
        Math.min(bracketMax - bracketMin, remainingAmount)
      );

      if (amountInBracket > 0) {
        breakdown.push({
          ...bracket,
          min: bracketMin,
          max: bracketMax === adjustedBase ? bracketMax : bracket.max,
          amountInBracket,
          taxOnBracket: amountInBracket * bracket.rate,
        });
      }

      remainingAmount -= amountInBracket;
      previousMax = bracket.max;
    }

    return breakdown;
  };

  const bracketBreakdown = calculateBracketBreakdown();

  const colorClasses = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
      dot: "bg-emerald-400",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
      dot: "bg-blue-400",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
      dot: "bg-amber-400",
    },
    orange: {
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      text: "text-orange-400",
      dot: "bg-orange-400",
    },
    red: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      text: "text-red-400",
      dot: "bg-red-400",
    },
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-slate-950/50 border-slate-700/50">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="irpf-education" className="border-none">
          <AccordionTrigger className="px-4 py-4 hover:no-underline">
            <div className="flex items-center gap-3 text-left">
              <Calculator className="size-5 text-primary" />
              <span className="text-lg font-semibold">
                Como o Imposto de Renda é Calculado
              </span>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            <div className="px-4 py-4 space-y-8">
              {/* Step 1: Base Calculation */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <h3 className="font-semibold text-lg text-main-text flex items-center gap-2">
                    <DollarSign className="size-5" />
                    Base de Cálculo
                  </h3>
                </div>

                <div className="ml-11">
                  <div className="space-y-4">
                    <p className="text-sm text-secondary-text max-w-lg">
                      Para calcular o IR, primeiro precisamos descobrir qual
                      parte do seu salário é tributável. Algumas deduções são
                      aplicadas antes do cálculo:
                    </p>

                    {/* Visual flow */}
                    <div className="flex items-center gap-2 lg:gap-3 flex-wrap justify-center sm:justify-start">
                      {/* Starting amount */}
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-center">
                        <div className="text-xs text-emerald-400 font-medium">
                          Salário Bruto
                        </div>
                        <div className="text-sm lg:text-lg font-bold text-emerald-100">
                          {formatCurrency(grossSalary)}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="text-muted-foreground text-sm lg:text-base">
                        →
                      </div>

                      {/* INSS deduction */}
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-center">
                        <div className="text-xs text-red-400 font-medium">
                          (-) INSS
                        </div>
                        <div className="text-sm lg:text-lg font-bold text-red-100">
                          {formatCurrency(inssDeduction)}
                        </div>
                      </div>

                      {alimony > 0 && (
                        <>
                          <div className="text-muted-foreground text-sm lg:text-base">
                            →
                          </div>
                          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-center">
                            <div className="text-xs text-red-400 font-medium">
                              (-) Pensão
                            </div>
                            <div className="text-sm lg:text-lg font-bold text-red-100">
                              {formatCurrency(alimony)}
                            </div>
                          </div>
                        </>
                      )}

                      {dependentsCount > 0 && (
                        <>
                          <div className="text-muted-foreground text-sm lg:text-base">
                            →
                          </div>
                          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-center">
                            <div className="text-xs text-blue-400 font-medium">
                              (-) {dependentsCount} Dep.
                            </div>
                            <div className="text-sm lg:text-lg font-bold text-blue-100">
                              {formatCurrency(dependentDeduction)}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Arrow */}
                      <div className="text-muted-foreground text-sm lg:text-base">
                        →
                      </div>

                      {/* Result */}
                      <div className="bg-primary/10 border border-primary/30 rounded-lg px-3 py-2 lg:px-4 lg:py-3 text-center">
                        <div className="text-xs text-primary font-medium">
                          Base para IR
                        </div>
                        <div className="text-lg lg:text-xl font-bold text-primary">
                          <NumberFlow
                            value={adjustedBase}
                            format={{
                              style: "currency",
                              currency: "BRL",
                              trailingZeroDisplay: "stripIfInteger",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs text-tertiary-text">
                        💡{" "}
                        {dependentsCount > 0
                          ? "INSS, pensão e dependentes são deduzidos antes de calcular o IR"
                          : "O INSS e pensão alimentícia são deduzidos antes de calcular o IR"}
                      </p>
                      {dependentsCount > 0 && (
                        <p className="text-xs text-tertiary-text">
                          👨‍👩‍👧‍👦 Dependentes incluem filhos, cônjuge sem renda, pais
                          idosos, entre outros
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Tax Brackets */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h3 className="font-semibold text-lg text-main-text flex items-center gap-2">
                    <TrendingUp className="size-5" />
                    Faixas de Tributação
                  </h3>
                </div>

                <div className="ml-11 space-y-4">
                  <p className="text-sm text-secondary-text">
                    O IR é calculado por faixas progressivas. Você só paga a
                    alíquota de cada faixa sobre o valor que excede o limite
                    anterior.
                  </p>

                  <div className="grid gap-3 lg:grid-cols-2">
                    {bracketBreakdown.map((bracket, index) => {
                      const theme =
                        colorClasses[
                          bracket.color as keyof typeof colorClasses
                        ];
                      const percentage =
                        (bracket.amountInBracket / adjustedBase) * 100;

                      return (
                        <div
                          key={index}
                          className={`rounded-lg p-3 lg:p-4 border ${theme.bg} ${theme.border}`}
                        >
                          {/* Header - always visible */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${theme.dot}`}
                              ></div>
                              <span className="text-xs lg:text-sm font-medium text-main-text">
                                {bracket.label}
                                <span className="hidden sm:inline">
                                  {" "}
                                  - {formatCurrency(bracket.min)} a{" "}
                                  {bracket.max === Infinity
                                    ? "acima"
                                    : formatCurrency(bracket.max)}
                                </span>
                              </span>
                            </div>
                            <span
                              className={`text-xs lg:text-sm font-bold ${theme.text}`}
                            >
                              {formatCurrency(bracket.amountInBracket)}
                            </span>
                          </div>

                          {/* Mobile: Simple range display */}
                          <div className="block sm:hidden mb-2">
                            <span className="text-xs text-tertiary-text">
                              {formatCurrency(bracket.min)} a{" "}
                              {bracket.max === Infinity
                                ? "acima"
                                : formatCurrency(bracket.max)}
                            </span>
                          </div>

                          {bracket.amountInBracket > 0 && (
                            <>
                              {/* Progress bar */}
                              <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                                <div
                                  className={`h-2 rounded-full ${theme.dot}`}
                                  style={{
                                    width: `${Math.min(percentage, 100)}%`,
                                  }}
                                ></div>
                              </div>

                              {/* Calculation details - hidden on mobile */}
                              <div className="hidden sm:flex justify-between text-xs">
                                <span className="text-tertiary-text">
                                  {bracket.rate > 0
                                    ? `${bracket.amountInBracket.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} × ${(bracket.rate * 100).toFixed(1)}%`
                                    : "Isento de imposto"}
                                </span>
                                <span className={`font-medium ${theme.text}`}>
                                  {bracket.rate > 0
                                    ? `= ${formatCurrency(bracket.taxOnBracket)}`
                                    : "R$ 0,00"}
                                </span>
                              </div>

                              {/* Mobile: Simple result */}
                              <div className="block sm:hidden text-center">
                                <span
                                  className={`text-xs font-medium ${theme.text}`}
                                >
                                  {bracket.rate > 0
                                    ? `Imposto: ${formatCurrency(bracket.taxOnBracket)}`
                                    : "Isento"}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 3: Final Result */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <h3 className="font-semibold text-lg text-main-text">
                    Resultado Final
                  </h3>
                </div>

                <div className="ml-11">
                  <div className="space-y-4">
                    <p className="text-sm text-secondary-text max-w-lg">
                      Após aplicar as faixas progressivas na sua base de
                      cálculo, este é o valor final do seu Imposto de Renda:
                    </p>

                    {/* Final result */}
                    <div className="flex justify-center">
                      <div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-3 lg:px-6 lg:py-4 text-center w-full max-w-sm">
                        <div className="text-sm text-primary font-medium mb-2">
                          Imposto de Renda Mensal
                        </div>
                        <div className="text-2xl lg:text-3xl font-bold text-primary">
                          <NumberFlow
                            value={finalIrpf}
                            format={{
                              style: "currency",
                              currency: "BRL",
                              trailingZeroDisplay: "stripIfInteger",
                            }}
                          />
                        </div>
                        <div className="text-xs text-tertiary-text mt-2">
                          {finalIrpf === 0
                            ? "🎉 Você está isento!"
                            : `${((finalIrpf / grossSalary) * 100).toFixed(2)}% do salário bruto`}
                        </div>
                      </div>
                    </div>

                    {finalIrpf > 0 && (
                      <p className="text-xs text-tertiary-text text-center">
                        💡 Este valor será descontado automaticamente do seu
                        salário todo mês
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
