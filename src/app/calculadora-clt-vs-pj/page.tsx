import { FormData } from "@/app/calculadora-clt-vs-pj/types";
import { decompress } from "@/app/calculadora-clt-vs-pj/utils";
import { PageWrapper } from "@/components/page-wrapper";
import { env } from "@/env";
import { SalaryCalculatorClient } from "./calculator";

// type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

// async function getSelicRate() {
//   try {
//     const response = await fetch(
//       "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1",
//       { next: { revalidate: 86400 } } // Revalidate every 24 hours (24 * 60 * 60 seconds)
//     );
//     const data = await response.json();
//     return Number(data[0].valor);
//   } catch (error) {
//     console.error("Error fetching SELIC rate:", error);
//     return 11.25; // Fallback value
//   }
// }

export const metadata = {
  title: "Calculadora de Salário CLT e PJ | Dev na Gringa",
  description:
    "Calcule o salário líquido de um profissional CLT e PJ para entender qual a melhor opção. Incluindo todos os benefícios.",
};

export default async function SalaryCalculator({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let initialData: FormData | undefined;

  const data = (await searchParams).d;

  if (data) {
    try {
      console.log("Trying to decompress data: ", data);
      initialData = decompress(data as string);
    } catch (e) {
      console.error("Failed to parse form data from URL", e);
    }
  }

  const selicRate = Number(env.NEXT_PUBLIC_SELIC_RATE);

  return (
    <PageWrapper>
      <SalaryCalculatorClient
        initialData={initialData}
        defaultInterestRate={selicRate}
      />
    </PageWrapper>
  );
}
