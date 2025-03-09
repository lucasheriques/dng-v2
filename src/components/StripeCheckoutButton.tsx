"use client";

import { createStripeCheckout } from "@/lib/actions";
import { useState } from "react";

interface StripeCheckoutButtonProps {
  productSlug: string;
}

export function StripeCheckoutButton({
  productSlug,
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createStripeCheckout(productSlug);

      if (result?.sessionUrl) {
        // Redirect to Stripe Checkout
        window.location.href = result.sessionUrl;
      } else {
        setError("Não foi possível criar a sessão de pagamento");
      }
    } catch (err) {
      console.error("Erro ao iniciar checkout:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Ocorreu um erro ao processar o pagamento"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        onClick={handleCheckout}
        disabled={isLoading}
      >
        {isLoading ? "Processando..." : "Pagar com Cartão"}
      </button>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
}
