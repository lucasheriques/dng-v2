import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { CalculationResults } from "../types";
import { InvestmentProjection } from "./investment-projection";

interface ComparisonCardProps {
  results: CalculationResults;
}

export function ComparisonCard({ results }: ComparisonCardProps) {
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
              <InvestmentProjection results={results} />
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
