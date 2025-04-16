import { CalculatorFormData } from "@/app/calculadora-clt-vs-pj/types";
import { decompress } from "@/app/calculadora-clt-vs-pj/utils";
import Comments from "@/components/comments";
import { PageWrapper } from "@/components/page-wrapper";
import { SalaryCalculatorClient } from "./calculator";
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata = {
  title: "Calculadora de Salário CLT e PJ | Dev na Gringa",
  description:
    "Calcule o salário líquido de um profissional CLT e PJ para entender qual a melhor opção. Incluindo todos os benefícios.",
};

const SELIC_RATE = 12.25;

export default async function SalaryCalculator({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let initialData: CalculatorFormData | undefined;

  const data = (await searchParams).d;

  if (data) {
    try {
      console.log("Trying to decompress data: ", data);
      initialData = decompress(data as string);
    } catch (e) {
      console.error("Failed to parse form data from URL", e);
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
