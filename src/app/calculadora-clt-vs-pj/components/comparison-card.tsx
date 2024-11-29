import { MilestoneChart } from "@/app/calculadora-clt-vs-pj/components/milestone-chart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { CalculationResults } from "../types";
import { InvestmentConfig } from "./investment-config";

const MILESTONES = [
  { name: "iPhone 16 Pro Max", value: 12499 },
  { name: "Toyota Corolla 0km", value: 156090 },
  { name: "Apartamento em SP", value: 800000 },
  { name: "Aposentadoria de 15k/mês (regra dos 4%)", value: 4500000 },
];

interface ComparisonCardProps {
  results: CalculationResults;
  defaultInterestRate: number;
}

export function ComparisonCard({
  results,
  defaultInterestRate,
}: ComparisonCardProps) {
  const [investmentRate, setInvestmentRate] = useState("20");
  const [interestRate, setInterestRate] = useState(String(defaultInterestRate));

  return (
    <>
      <Accordion type="single" collapsible defaultValue="investment-projection">
        <AccordionItem value="investment-projection">
          <AccordionTrigger className="bg-slate-800/50 p-4">
            Simular Projeção de Investimento
          </AccordionTrigger>
          <AccordionContent className="pb-0 bg-slate-800/50 p-4">
            <div className="space-y-4">
              {results.pj.total > 0 && results.clt.total > 0 ? (
                <>
                  <InvestmentConfig
                    cltMonthlyTotal={results.clt.total}
                    pjMonthlyTotal={results.pj.total}
                    investmentRate={investmentRate}
                    interestRate={interestRate}
                    onInvestmentRateChange={setInvestmentRate}
                    onInterestRateChange={setInterestRate}
                  />

                  <MilestoneChart
                    cltMonthlyTotal={results.clt.total}
                    pjMonthlyTotal={results.pj.total}
                    investmentRate={Number(investmentRate)}
                    interestRate={Number(interestRate) / 100}
                    milestones={MILESTONES}
                  />
                </>
              ) : (
                <p className="text-sm text-slate-400">
                  Você só consegue investir se o teu salário for maior que 0. 😅
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
