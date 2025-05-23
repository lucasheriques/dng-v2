"use client";

import { DollarSignIcon, TriangleAlert } from "lucide-react";
import { RetirementIncomeCard } from "../../app/calculadora-juros-compostos/components/retirement-income-card";

interface RetirementIncomeSectionProps {
  finalAmount: number;
}

export function RetirementIncomeSection({
  finalAmount,
}: RetirementIncomeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <DollarSignIcon className="size-4 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold">Renda mensal na aposentadoria</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RetirementIncomeCard
          title="Saques seguros de 4%"
          percentage={4}
          finalAmount={finalAmount}
          tooltipContent="Regra dos 4%: Considerada segura para aposentadorias de ~30 anos. Baseada em estudos históricos do mercado americano, permite saques anuais de 4% do patrimônio (ajustados pela inflação) com alta probabilidade de não esgotar o dinheiro."
          duration="≈ 30 anos de duração segura"
          colorTheme="emerald"
        />

        <RetirementIncomeCard
          title="Saques seguros de 3%"
          percentage={3}
          finalAmount={finalAmount}
          tooltipContent="Regra dos 3%: Mais conservadora e segura para aposentadorias longas (40+ anos) ou indefinidas. Oferece maior margem de segurança contra inflação alta e crises de mercado prolongadas, sendo ideal para aposentadorias muito precoces."
          duration="≈ Duração indefinida"
          colorTheme="blue"
        />
      </div>

      <div className="text-xs text-tertiary-text p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
        <div className="flex items-start gap-2">
          <TriangleAlert className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-2">
            <p className="font-medium text-amber-200">Importante</p>
            <p>
              Estes cálculos são baseados em estudos históricos do mercado
              americano, principalmente no
              <strong> Trinity Study (1998)</strong> e nas pesquisas de{" "}
              <strong>Bill Bengen (1994)</strong>. No Brasil, devido à maior
              volatilidade econômica e inflação historicamente mais alta, pode
              ser prudente considerar taxas ainda mais conservadoras.
            </p>
            <p>
              As informações nessa página são apenas informativas e não devem
              ser consideradas como aconselhamento financeiro.
            </p>
            <p>
              <strong>Fontes:</strong> Trinity Study (Trinity University, 1998);
              Bengen, W. P.{" "}
              <a
                href="https://www.financialplanningassociation.org/sites/default/files/2021-04/MAR04%20Determining%20Withdrawal%20Rates%20Using%20Historical%20Data.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                &ldquo;Determining Withdrawal Rates Using Historical Data&rdquo;
                (Journal of Financial Planning, 1994)
              </a>
              . Consulte um planejador financeiro para adequar à realidade
              brasileira.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
