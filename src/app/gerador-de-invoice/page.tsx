import InvoiceGenerator from "@/app/gerador-de-invoice/invoice-generator";
import Comments from "@/components/comments/comments";
import { PageWrapper } from "@/components/page-wrapper";

export const metadata = {
  title: "Gerador de Invoice | Dev na Gringa",
  description:
    "Crie invoices para enviar aos seus clientes em trabalhos internacionais facilmente.",
};

export default function InvoicePage() {
  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold">Gerador de Invoice</h1>
      <InvoiceGenerator />
      <Comments slug="gerador-de-invoice" />
    </PageWrapper>
  );
}
