import InvestmentCalculator from "@/app/calculadora-juros-compostos/investment-calculator";
import Comments from "@/components/comments";
import { PageWrapper } from "@/components/page-wrapper";
import { InvestmentCalculatorData } from "./types";

export const metadata = {
  title: "Calculadora de Juros Compostos | Dev na Gringa",
  description:
    "Calculadora de Juros Compostos online. Utilize esta calculadora para simular cálculos de juros compostos em investimentos.",
};

// Default values (consistent with calculator component)
const defaultValues: InvestmentCalculatorData = {
  initialDeposit: 10000,
  monthlyContribution: 1000,
  period: 10,
  periodType: "anos",
  interestRate: 5.5,
};

// Helper to safely parse numbers from search params
const safeParseFloat = (
  value: string | string[] | undefined,
  defaultValue: number
): number => {
  if (typeof value !== "string") return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Define type for search params
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function InterestRateCalculator({
  searchParams: params,
}: {
  searchParams: SearchParams;
}) {
  const initialData: InvestmentCalculatorData = { ...defaultValues };

  const searchParams = await params;

  // Read individual params using short keys and validate
  const initialDepositParam = searchParams?.i; // Use 'i'
  if (initialDepositParam !== undefined) {
    initialData.initialDeposit = safeParseFloat(
      initialDepositParam,
      defaultValues.initialDeposit
    );
  }

  const monthlyContributionParam = searchParams?.m; // Use 'm'
  if (monthlyContributionParam !== undefined) {
    initialData.monthlyContribution = safeParseFloat(
      monthlyContributionParam,
      defaultValues.monthlyContribution
    );
  }

  const periodParam = searchParams?.p; // Use 'p'
  if (periodParam !== undefined) {
    initialData.period = safeParseFloat(periodParam, defaultValues.period);
  }

  const periodTypeParam = searchParams?.pt; // Use 'pt'
  if (
    typeof periodTypeParam === "string" &&
    (periodTypeParam === "meses" || periodTypeParam === "anos")
  ) {
    initialData.periodType = periodTypeParam;
  }

  const interestRateParam = searchParams?.r; // Use 'r'
  if (interestRateParam !== undefined) {
    initialData.interestRate = safeParseFloat(
      interestRateParam,
      defaultValues.interestRate
    );
  }

  return (
    <PageWrapper className="flex flex-col gap-32">
      <div>
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold">Calculadora de Juros Compostos</h1>
          <p className="pb-12 text-slate-300">
            Use essa calculadora de juros compostos para planejar seus objetivos
            financeiros. Calcule como suas economias podem crescer com
            diferentes valores de depósito, taxas de juros e períodos de tempo.
          </p>
        </div>
        <InvestmentCalculator initialData={initialData} />
      </div>
      <Comments slug="calculadora-juros-compostos" />
    </PageWrapper>
  );
}
