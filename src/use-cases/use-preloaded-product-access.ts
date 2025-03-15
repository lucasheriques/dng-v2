"use client";
import { useAuth } from "@/use-cases/use-auth";
import { api } from "@convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";

export function usePreloadedProductAccess(
  preloaded: Preloaded<typeof api.products.getProductAndAccess>
) {
  const query = usePreloadedQuery(preloaded);
  const { hasPaidSubscription } = useAuth();

  if (!query || !query.product || !query.hasAccess) {
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
