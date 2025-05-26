import { ExpandableCard } from "@/components/ui/expandable-card";
import { CalculationResults } from "@/use-cases/calculator/salary-calculations";
import { ChartSpline } from "lucide-react";
import Link from "next/link";
import { InvestmentProjection } from "./investment-projection";

interface ComparisonCardProps {
  results: CalculationResults;
}

export function ComparisonCard({ results }: ComparisonCardProps) {
  return (
    <ExpandableCard
      title="Simular Projeção de Investimento"
      icon={<ChartSpline className="size-5 text-primary" />}
    >
      <div className="pb-0 space-y-4">
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
      </div>
    </ExpandableCard>
  );
}
