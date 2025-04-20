"use client";

import { DataForm, DataFormHeader } from "@/components/data-forms";
import { SELIC_RATE } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { CalculationResults } from "../types";
import { InvestmentConfig } from "./investment-config";
import { MilestoneChart, formatTime } from "./milestone-chart";

const MILESTONES = [
  { name: "iPhone 16 Pro Max", value: 12499 },
  { name: "Toyota Corolla 0km", value: 156090 },
  { name: "Apartamento em SP", value: 800000 },
  { name: "Aposentadoria de 15k/mês (regra dos 4%)", value: 4500000 },
];

interface InvestmentProjectionProps {
  results: CalculationResults;
}

export function InvestmentProjection({ results }: InvestmentProjectionProps) {
  const [cltInvestmentRate, setCltInvestmentRate] = useState("20");
  const [pjInvestmentRate, setPjInvestmentRate] = useState("20");
  const [interestRate, setInterestRate] = useState(String(SELIC_RATE));
  const [years, setYears] = useState(String("30"));

  const monthlyRate = Math.pow(1 + Number(interestRate) / 100, 1 / 12) - 1;
  const cltMonthlyInvestment =
    (results.clt.total * Number(cltInvestmentRate)) / 100;
  const pjMonthlyInvestment =
    (results.pj.total * Number(pjInvestmentRate)) / 100;

  const chartData = Array.from({ length: Number(years) * 12 }, (_, month) => {
    const cltPatrimony =
      cltMonthlyInvestment *
      ((Math.pow(1 + monthlyRate, month + 1) - 1) / monthlyRate);
    const pjPatrimony =
      pjMonthlyInvestment *
      ((Math.pow(1 + monthlyRate, month + 1) - 1) / monthlyRate);

    return {
      month: month + 1,
      clt: cltPatrimony,
      pj: pjPatrimony,
    };
  });

  const chartConfig = {
    clt: {
      label: "CLT",
      color: "var(--chart-blue)",
    },
    pj: {
      label: "PJ",
      color: "var(--chart-pink)",
    },
  };

  return (
    <>
      <div className="grid lg:grid-cols-2 gap-4">
        <InvestmentConfig
          cltMonthlyTotal={results.clt.total}
          pjMonthlyTotal={results.pj.total}
          cltInvestmentRate={cltInvestmentRate}
          pjInvestmentRate={pjInvestmentRate}
          interestRate={interestRate}
          onCltInvestmentRateChange={setCltInvestmentRate}
          onPjInvestmentRateChange={setPjInvestmentRate}
          onInterestRateChange={setInterestRate}
          years={years}
          onYearsChange={setYears}
        />
        <MilestoneChart data={chartData} chartConfig={chartConfig} />
        <div className="lg:col-span-2 lg:pt-4">
          <DataForm className="hidden md:block">
            <DataFormHeader>
              Marcos Financeiros e Tempo de Investimento
            </DataFormHeader>
            <div className="grid grid-cols-4 border-b">
              <div className="p-3 border-r font-medium">
                <span className="ate">Objetivo</span>
              </div>
              <div className="p-3 border-r text-right font-medium">
                <span className="text-sm">Valor</span>
              </div>
              <div className="p-3 border-r text-right font-medium">
                <span className="text-sm text-chart-blue">Tempo CLT</span>
              </div>
              <div className="p-3 text-right font-medium">
                <span className="text-sm text-chart-pink">Tempo PJ</span>
              </div>
            </div>
            {MILESTONES.map((milestone) => {
              const cltMonthsToReach = chartData.findIndex(
                (d) => d.clt >= milestone.value
              );
              const pjMonthsToReach = chartData.findIndex(
                (d) => d.pj >= milestone.value
              );

              return (
                <div
                  key={milestone.name}
                  className="grid grid-cols-4 border-b  last:border-b-0"
                >
                  <div className="p-3 border-r ">
                    <span className="text-sm">{milestone.name}</span>
                  </div>
                  <div className="p-3 border-r  text-right">
                    <span className="text-sm text-slate-400">
                      {formatCurrency(milestone.value)}
                    </span>
                  </div>
                  <div className="p-3 border-r  text-right">
                    <span className="text-sm text-chart-blue">
                      {formatTime(cltMonthsToReach, Number(years))}
                    </span>
                  </div>
                  <div className="p-3 text-right">
                    <span className="text-sm text-chart-pink">
                      {formatTime(pjMonthsToReach, Number(years))}
                    </span>
                  </div>
                </div>
              );
            })}
          </DataForm>

          <div className="md:hidden space-y-4">
            <h3 className="text-lg font-semibold">
              Marcos Financeiros e Tempo de Investimento
            </h3>
            {MILESTONES.map((milestone) => {
              const cltMonthsToReach = chartData.findIndex(
                (d) => d.clt >= milestone.value
              );
              const pjMonthsToReach = chartData.findIndex(
                (d) => d.pj >= milestone.value
              );

              return (
                <div
                  key={milestone.name}
                  className="p-4 border  rounded-lg bg-slate-900/50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{milestone.name}</span>
                    <span className="text-slate-400">
                      {formatCurrency(milestone.value)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-400">Tempo CLT</span>
                      <span className="text-blue-400">
                        {formatTime(cltMonthsToReach)}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-slate-400">Tempo PJ</span>
                      <span className="text-pink-400">
                        {formatTime(pjMonthsToReach)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Marcos Financeiros Table Section */}
      <div className="space-y-8"></div>
    </>
  );
}
