import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SubscriptionSection() {
  return (
    <section className="bg-linear-to-r from-slate-900 to-slate-800 p-6 rounded-lg border ">
      <h2 className="text-xl font-semibold mb-3">Gerenciar sua Assinatura</h2>
      <p className="mb-4">
        Precisa atualizar seus dados de pagamento, alterar seu plano ou cancelar
        sua assinatura?
      </p>
      <Button asChild>
        <Link
          href="https://newsletter.nagringa.dev/account?utm_source=nagringa.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Gerenciar Assinatura
        </Link>
      </Button>
    </section>
  );
}
