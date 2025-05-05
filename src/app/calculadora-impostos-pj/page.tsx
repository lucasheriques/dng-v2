import { PjTaxCalculatorClient } from "@/app/calculadora-impostos-pj/pj-tax-calculator";
import Comments from "@/components/comments";
import { PageWrapper } from "@/components/page-wrapper";
import { env } from "@/env";
import { Metadata } from "next";
// TODO: Implement dynamic metadata based on search params if needed

export const metadata: Metadata = {
  title: "Calculadora de Impostos PJ (Simples Nacional) | Dev na Gringa",
  description:
    "Simule os impostos (Simples Nacional, INSS, IRPF) para sua empresa PJ de desenvolvimento de software, considerando Fator R e exportação de serviços.",
  openGraph: {
    title: "Calculadora de Impostos PJ (Simples Nacional) | Dev na Gringa",
    description:
      "Simule os impostos para sua empresa PJ de desenvolvimento de software.",
    url: `${env.NEXT_PUBLIC_BASE_URL}/calculadora-impostos-pj`,
    // TODO: Add OG image generation similar to CLT vs PJ calc
    images: [
      {
        url: `${env.NEXT_PUBLIC_BASE_URL}/images/og/default.png`, // Placeholder
        width: 1200,
        height: 630,
        alt: "Calculadora de Impostos PJ",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Impostos PJ (Simples Nacional) | Dev na Gringa",
    description:
      "Simule os impostos para sua empresa PJ de desenvolvimento de software.",
    images: [`${env.NEXT_PUBLIC_BASE_URL}/images/og/default.png`], // Placeholder
  },
};

export default async function PjTaxCalculatorPage() {
  // TODO: Add logic to parse initialData from searchParams if needed

  return (
    <PageWrapper>
      <PjTaxCalculatorClient /* initialData={initialData} */ />
      <Comments slug="calculadora-impostos-pj" />
    </PageWrapper>
  );
}
