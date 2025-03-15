"use client";
import { useAuth } from "@/use-cases/use-auth";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react/cache/hooks";
import { usePreloadedQuery } from "convex/react";

export function useProductAccess(productSlug: string) {
  const query = usePreloadedQuery(api.products.getProductAndAccess, {
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
