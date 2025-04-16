import InvestmentCalculator from "@/app/calculadora-juros-compostos/investment-calculator";
import Comments from "@/components/comments";
import { PageWrapper } from "@/components/page-wrapper";

export const metadata = {
  title: "Calculadora de Juros Compostos | Dev na Gringa",
  description:
    "Calculadora de Juros Compostos online. Utilize esta calculadora para simular cálculos de juros compostos em investimentos.",
};

export default function SalaryCalculator() {
  return (
    <PageWrapper className="flex flex-col gap-32">
      <div>
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Calculadora de Investimentos</h1>
          <p className="pb-12 text-slate-300">
            Use essa calculadora de juros compostos para planejar seus objetivos
            financeiros. Calcule como suas economias podem crescer com
            diferentes valores de depósito, taxas de juros e períodos de tempo.
          </p>
        </div>
        <InvestmentCalculator />
      </div>
      <Comments slug="calculadora-juros-compostos" />
    </PageWrapper>
  );
}
