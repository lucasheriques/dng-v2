import { CalculatorLinks } from "@/components/calculator-links";
import Comments from "@/components/comments";
import { PageWrapper } from "@/components/page-wrapper";
import { env } from "@/env";
import {
  DEFAULT_CLT_FORM_DATA,
  REVERSE_CLT_PARAM_MAP,
} from "@/use-cases/calculator/constants";
import { CLTCalculatorFormData } from "@/use-cases/calculator/types";
import {
  safeParseBoolean,
  safeParseNumberString,
} from "@/use-cases/calculator/utils";
import { Metadata } from "next";
import { CltSalaryCalculator } from "./clt-salary-calculator";

export async function generateMetadata({
  searchParams: params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const searchParams = await params;
  const baseUrl = env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const ogUrl = new URL("/api/og/clt-salary", baseUrl);

  // Add URL parameters for OG image generation
  for (const shortKey in REVERSE_CLT_PARAM_MAP) {
    const formKey = REVERSE_CLT_PARAM_MAP[shortKey];
    const value = searchParams[shortKey];
    const defaultValue = DEFAULT_CLT_FORM_DATA[formKey];

    if (value !== undefined) {
      if (formKey === "includeFGTS") {
        const boolValue = safeParseBoolean(value, defaultValue as boolean);
        if (boolValue !== defaultValue) {
          ogUrl.searchParams.set(shortKey, boolValue ? "1" : "0");
        }
      } else {
        const stringValue = safeParseNumberString(
          value,
          defaultValue as string
        );
        if (stringValue !== defaultValue && stringValue !== "") {
          ogUrl.searchParams.set(shortKey, stringValue);
        }
      }
    }
  }

  const title =
    "Calculadora de Salário Líquido 2025: Calcule Grátis Online | INSS e IRRF";
  const description =
    "🧮 Calculadora de salário líquido GRÁTIS e atualizada 2025. Calcule seu salário líquido CLT descontando INSS, IRRF, vale-transporte e dependentes. Resultado instantâneo e preciso!";

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
          alt: "Calculadora de Salário Líquido CLT",
        },
      ],
      locale: "pt_BR",
      type: "website",
      url: `${baseUrl}/calculadora-salario-liquido`,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogUrl.toString()],
    },
    keywords: [
      "calculadora salário líquido",
      "calculadora salario liquido",
      "calcular salário líquido online",
      "calculadora salario liquido 2025",
      "salário líquido CLT",
      "calcular salário líquido grátis",
      "salário bruto x líquido",
      "desconto INSS salário",
      "desconto IRRF salário",
      "imposto de renda na fonte",
      "calculadora salário líquido gratuita",
      "13º salário",
      "férias proporcional",
      "vale transporte desconto",
      "CLT salário líquido",
      "quanto vou receber líquido",
      "tabela INSS 2025",
      "tabela IRRF 2025",
    ],
  };
}

export default async function SalaryCalculatorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const initialData: Partial<CLTCalculatorFormData> = {};

  const params = await searchParams;

  for (const shortKey in REVERSE_CLT_PARAM_MAP) {
    const formKey = REVERSE_CLT_PARAM_MAP[shortKey];
    const value = params[shortKey];

    if (value !== undefined) {
      if (formKey === "includeFGTS") {
        initialData[formKey] = safeParseBoolean(
          value,
          DEFAULT_CLT_FORM_DATA[formKey]
        );
      } else {
        const stringValue = safeParseNumberString(
          value,
          DEFAULT_CLT_FORM_DATA[formKey] as string
        );
        if (stringValue !== "") {
          initialData[formKey] = stringValue;
        }
      }
    }
  }

  return (
    <PageWrapper>
      <CalculatorLinks />
      <CltSalaryCalculator initialData={initialData} />
      <Comments slug="calculadora-salario-liquido" />
    </PageWrapper>
  );
}
