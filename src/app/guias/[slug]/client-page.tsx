"use client";

import { AccessGate } from "@/components/products/product-access/access-gate";
import { usePreloadedProductAccess } from "@/use-cases/use-preloaded-product-access";
import { api } from "@convex/_generated/api";
import { Preloaded } from "convex/react";

interface ProductPageProps {
  preloadedProduct: Preloaded<typeof api.products.getProductAndAccess>;
  content: React.ReactNode;
}

export function ProductPage({ preloadedProduct, content }: ProductPageProps) {
  const { product, hasAccess } = usePreloadedProductAccess(preloadedProduct);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Produto não encontrado</h1>
        <p>Desculpe, o produto solicitado não foi encontrado.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

      <AccessGate productId={product._id} hasAccess={hasAccess}>
        {content}
      </AccessGate>
    </div>
  );
}
