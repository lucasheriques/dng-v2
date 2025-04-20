import { MilestoneChart } from "@/app/calculadora-clt-vs-pj/components/milestone-chart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SELIC_RATE } from "@/lib/constants";
import Link from "next/link";
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
}

export function ComparisonCard({ results }: ComparisonCardProps) {
  const [cltInvestmentRate, setCltInvestmentRate] = useState("20");
  const [pjInvestmentRate, setPjInvestmentRate] = useState("20");
  const [interestRate, setInterestRate] = useState(String(SELIC_RATE));

  return (
    <>
      <Accordion type="single" collapsible>
        <AccordionItem value="investment-projection">
          <AccordionTrigger>
            <h3>Simular Projeção de Investimento</h3>
          </AccordionTrigger>
          <AccordionContent className="pb-0 space-y-4">
            <Link
              href="/calculadora-juros-compostos"
              className="hover:border-b hover:border-b-primary hover:text-primary transition-all inline-block"
            >
              Veja também minha calculadora de juros compostos.
            </Link>
            {results.pj.total > 0 && results.clt.total > 0 ? (
              <>
                <InvestmentConfig
                  cltMonthlyTotal={results.clt.total}
                  pjMonthlyTotal={results.pj.total}
                  cltInvestmentRate={cltInvestmentRate}
                  pjInvestmentRate={pjInvestmentRate}
                  interestRate={interestRate}
                  onCltInvestmentRateChange={setCltInvestmentRate}
                  onPjInvestmentRateChange={setPjInvestmentRate}
                  onInterestRateChange={setInterestRate}
                />

                <MilestoneChart
                  cltMonthlyTotal={results.clt.total}
                  pjMonthlyTotal={results.pj.total}
                  cltInvestmentRate={Number(cltInvestmentRate)}
                  pjInvestmentRate={Number(pjInvestmentRate)}
                  interestRate={Number(interestRate) / 100}
                  milestones={MILESTONES}
                />
              </>
            ) : (
              <p className="text-sm text-slate-400">
                Você só consegue investir se o teu salário for maior que 0. 😅
              </p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
}
