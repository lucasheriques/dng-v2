import { Button } from "@/components/ui/button";
import { useGenerateStripeLink } from "@/use-cases/use-generate-stripe-link";
import { Id } from "@convex/_generated/dataModel";

type Props = {
  productId: Id<"products">;
  userId: Id<"users">;
};

export function PayWithCardButton({ productId, userId }: Props) {
  const { generateStripeLink, isLoading } = useGenerateStripeLink({
    userId,
    productId,
  });

  return (
    <Button onClick={generateStripeLink} loading={isLoading}>
      Pagar com cartão
    </Button>
  );
}
