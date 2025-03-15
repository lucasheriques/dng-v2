import { Button } from "@/components/ui/button";
import { useGeneratePixLink } from "@/use-cases/use-generate-pix-link";
import { Id } from "@convex/_generated/dataModel";

type Props = {
  productId: Id<"products">;
  userId: Id<"users">;
};

export function PayWithPixButton({ productId, userId }: Props) {
  const { generatePixLink, isLoading } = useGeneratePixLink({
    userId,
    productId,
  });

  return (
    <Button onClick={generatePixLink} variant="outline" loading={isLoading}>
      Pagar com PIX
    </Button>
  );
}
