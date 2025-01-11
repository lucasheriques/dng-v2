import InvoiceGenerator from "@/app/gerador-de-invoice/invoice-generator";
import { PageWrapper } from "@/components/page-wrapper";

export const metadata = {
  title: "Gerador de Invoice | Dev na Gringa",
  description:
    "Crie invoices para enviar aos seus clientes em trabalhos internacionais facilmente.",
};

export default function InvoicePage() {
  return (
    <PageWrapper className="space-y-8">
      <h1 className="text-3xl font-bold">Gerador de Invoice</h1>
      <InvoiceGenerator />
    </PageWrapper>
  );
}
