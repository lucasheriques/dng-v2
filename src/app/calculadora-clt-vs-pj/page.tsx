import { CalculatorFormData } from "@/app/calculadora-clt-vs-pj/types";
import Comments from "@/components/comments";
import { PageWrapper } from "@/components/page-wrapper";
import { env } from "@/env";
import { Metadata } from "next";
import { SalaryCalculatorClient } from "./salary-calculator";
import {
  defaultFormData,
  reverseParamMap,
  safeParseBoolean,
  safeParseNumberString,
} from "./types";

export async function generateMetadata({
  searchParams: params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const searchParams = await params;
  const baseUrl = env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
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

  const title = "Calculadora CLT vs. PJ | Dev na Gringa";
  const description =
    "Calculadora de salário líquido CLT vs PJ. Inclui todos os benefícios, como 13º salário e férias. Veja qual a melhor opção para você.";

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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const initialData: CalculatorFormData = { ...defaultFormData };

  const params = await searchParams;

  for (const shortKey in reverseParamMap) {
    const formKey = reverseParamMap[shortKey];
    const value = params[shortKey];

    if (value !== undefined) {
      if (formKey === "includeFGTS") {
        initialData[formKey] = safeParseBoolean(
          value,
          defaultFormData[formKey]
        );
      } else {
        const stringValue = safeParseNumberString(
          value,
          defaultFormData[formKey] as string
        );
        if (stringValue !== "") {
          initialData[formKey] = stringValue;
        }
      }
    }
  }

  return (
    <PageWrapper>
      <SalaryCalculatorClient initialData={initialData} />
      <Comments slug="calculadora-clt-vs-pj" />
    </PageWrapper>
  );
}
