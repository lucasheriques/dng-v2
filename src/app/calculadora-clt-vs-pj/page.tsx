import { CalculatorFormData } from "@/app/calculadora-clt-vs-pj/types";
import Comments from "@/components/comments";
import { PageWrapper } from "@/components/page-wrapper";
import { Metadata } from "next";
import { SalaryCalculatorClient } from "./calculator";

const defaultFormData: CalculatorFormData = {
  grossSalary: "",
  pjGrossSalary: "",
  mealAllowance: "",
  transportAllowance: "",
  healthInsurance: "",
  otherBenefits: "",
  includeFGTS: true,
  yearsAtCompany: "",
  accountingFee: "189",
  inssContribution: String(1412 * 0.11),
  taxRate: "10",
  otherExpenses: "",
  taxableBenefits: "",
  nonTaxableBenefits: "",
  plr: "",
};

const paramMap: { [K in keyof CalculatorFormData]?: string } = {
  grossSalary: "gs",
  pjGrossSalary: "pjs",
  mealAllowance: "ma",
  transportAllowance: "ta",
  healthInsurance: "hi",
  otherBenefits: "ob",
  includeFGTS: "fgts",
  yearsAtCompany: "yc",
  accountingFee: "af",
  inssContribution: "inss",
  taxRate: "tr",
  otherExpenses: "oe",
  taxableBenefits: "tb",
  nonTaxableBenefits: "nb",
  plr: "plr",
};

const reverseParamMap: { [key: string]: keyof CalculatorFormData } = {};
for (const key in paramMap) {
  const formKey = key as keyof CalculatorFormData;
  const shortKey = paramMap[formKey];
  if (shortKey) {
    reverseParamMap[shortKey] = formKey;
  }
}

const SELIC_RATE = 12.25;

const safeParseString = (
  value: string | string[] | undefined,
  defaultValue: string
): string => {
  return typeof value === "string" ? value : defaultValue;
};

const safeParseBoolean = (
  value: string | string[] | undefined,
  defaultValue: boolean
): boolean => {
  if (typeof value !== "string") return defaultValue;
  return value === "1" ? true : value === "0" ? false : defaultValue;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const ogUrl = new URL("/api/og/clt-vs-pj", baseUrl);

  for (const shortKey in reverseParamMap) {
    const formKey = reverseParamMap[shortKey];
    const value = searchParams[shortKey];
    const defaultValue = defaultFormData[formKey];

    if (value !== undefined) {
      if (formKey === "includeFGTS") {
        const boolValue = safeParseBoolean(value, defaultValue as boolean);
        if (boolValue !== defaultValue) {
          ogUrl.searchParams.set(shortKey, boolValue ? "1" : "0");
        }
      } else {
        const stringValue = safeParseString(value, defaultValue as string);
        if (stringValue !== defaultValue && stringValue !== "") {
          ogUrl.searchParams.set(shortKey, stringValue);
        }
      }
    }
  }

  const title = "Calculadora CLT vs. PJ | Dev na Gringa";
  const description =
    "Simule e compare salários líquidos CLT e PJ com benefícios. Descubra a melhor opção para você.";

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
          alt: "Comparativo de Salário CLT vs PJ",
        },
      ],
      locale: "pt_BR",
      type: "website",
      url: `${baseUrl}/calculadora-clt-vs-pj`,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: [ogUrl.toString()],
    },
  };
}

export default async function SalaryCalculatorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const initialData: CalculatorFormData = { ...defaultFormData };

  for (const shortKey in reverseParamMap) {
    const formKey = reverseParamMap[shortKey];
    const value = searchParams[shortKey];

    if (value !== undefined) {
      if (formKey === "includeFGTS") {
        initialData[formKey] = safeParseBoolean(
          value,
          defaultFormData[formKey]
        );
      } else {
        const stringValue = safeParseString(value, "");
        if (stringValue !== "") {
          initialData[formKey] = stringValue;
        }
      }
    }
  }

  return (
    <PageWrapper>
      <SalaryCalculatorClient
        initialData={initialData}
        defaultInterestRate={SELIC_RATE}
      />
      <Comments slug="calculadora-clt-vs-pj" />
    </PageWrapper>
  );
}
