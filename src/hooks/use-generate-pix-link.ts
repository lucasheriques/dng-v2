import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useAction } from "convex/react";
import { useState } from "react";

type Args = {
  userId?: Id<"users">;
  productId?: Id<"products">;
};

export function useGeneratePixLink(args: Args) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pay = useAction(api.pix.createPixPayment);

  async function generatePixLink() {
    setIsLoading(true);
    setError(null);

    const userId = args.userId;
    const productId = args.productId;

    if (!userId || !productId) {
      throw new Error("userId and productId are required");
    }

    try {
      const result = await pay({
        userId,
        productId,
      });

      if (result) {
        window.location.href = result;
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }

  return { generatePixLink, isLoading, error };
}
