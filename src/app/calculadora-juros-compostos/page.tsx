import InvestmentCalculator from "@/app/calculadora-juros-compostos/investment-calculator";
import Comments from "@/components/comments";
import { PageWrapper } from "@/components/page-wrapper";
import { env } from "@/env";
import { Metadata } from "next";
import { InvestmentCalculatorData } from "./types";

// Default values matching the calculator component and API route
const defaultValues: InvestmentCalculatorData = {
  initialDeposit: 10000,
  monthlyContribution: 1000,
  period: 10,
  periodType: "years",
  interestRate: 5.5,
};

// Function to generate metadata dynamically
export async function generateMetadata({
  searchParams: params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const searchParams = await params;
  const baseUrl = env.NEXT_PUBLIC_BASE_URL;
  const ogUrl = new URL("/api/og/investment", baseUrl);

  // Append parameters only if they differ from defaults, matching the client-side logic
  const initialDeposit = searchParams?.i
    ? Number(searchParams.i)
    : defaultValues.initialDeposit;
  const monthlyContribution = searchParams?.m
    ? Number(searchParams.m)
    : defaultValues.monthlyContribution;
  const period = searchParams?.p
    ? Number(searchParams.p)
    : defaultValues.period;
  const periodType = searchParams?.pt
    ? String(searchParams.pt)
    : defaultValues.periodType;
  const interestRate = searchParams?.r
    ? Number(searchParams.r)
    : defaultValues.interestRate;

  // Validate and only add valid, non-default params to the OG image URL
  if (
    !isNaN(initialDeposit) &&
    initialDeposit !== defaultValues.initialDeposit
  ) {
    ogUrl.searchParams.set("i", String(initialDeposit));
  }
  if (
    !isNaN(monthlyContribution) &&
    monthlyContribution !== defaultValues.monthlyContribution
  ) {
    ogUrl.searchParams.set("m", String(monthlyContribution));
  }
  if (!isNaN(period) && period !== defaultValues.period) {
    ogUrl.searchParams.set("p", String(period));
  }
  if (
    (periodType === "months" || periodType === "years") &&
    periodType !== defaultValues.periodType
  ) {
    ogUrl.searchParams.set("pt", periodType);
  }
  if (!isNaN(interestRate) && interestRate !== defaultValues.interestRate) {
    ogUrl.searchParams.set("r", String(interestRate));
  }

  const title = "Calculadora de Juros Compostos | Dev na Gringa";
  const description =
    "Simule o crescimento do seu patrimônio com nossa calculadora de juros compostos online e gratuita. Veja o poder dos juros sobre juros em ação!";

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: "Resultado da Simulação de Investimento",
        },
      ],
      locale: "pt_BR",
      type: "website",
      url: `${baseUrl}/calculadora-juros-compostos`, // Canonical URL
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function CalculadoraJurosCompostosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Parse initial data from searchParams for the client component
  // Use Partial and only include values present in searchParams

  const params = await searchParams;
  const initialData: Partial<InvestmentCalculatorData> = {};
  if (params?.i && !isNaN(Number(params.i))) {
    initialData.initialDeposit = Number(params.i);
  }
  if (params?.m && !isNaN(Number(params.m))) {
    initialData.monthlyContribution = Number(params.m);
  }
  if (params?.p && !isNaN(Number(params.p))) {
    initialData.period = Number(params.p);
  }
  if (
    params?.pt &&
    typeof params.pt === "string" &&
    (params.pt === "months" || params.pt === "years") // Validate periodType
  ) {
    initialData.periodType = params.pt;
  }
  if (params?.r && !isNaN(Number(params.r))) {
    initialData.interestRate = Number(params.r);
  }

  return (
    <PageWrapper>
      <InvestmentCalculator initialData={initialData} />
      <div className="text-center text-slate-400 text-sm">
        <p>
          Use esta calculadora para simular seus investimentos e visualizar o
          crescimento ao longo do tempo.
        </p>
        <p>Ajuste os valores e compartilhe os resultados!</p>
      </div>
      <Comments slug="calculadora-juros-compostos" />
    </PageWrapper>
  );
}
