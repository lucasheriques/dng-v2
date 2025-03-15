"use client";
import { useAuth } from "@/use-cases/use-auth";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react/cache/hooks";

export function useProductAccess(productSlug: string) {
  const query = useQuery(api.products.getProductAndAccess, {
    slug: productSlug,
  });
  const { hasPaidSubscription } = useAuth();

  if (!query) {
    return {
      product: null,
      hasAccess: false,
    };
  }

  const { product, hasAccess } = query;
  return {
    product,
    hasAccess: hasAccess || hasPaidSubscription,
  };
}
