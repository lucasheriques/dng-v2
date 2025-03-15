"use client";

import { BookViewer } from "@/components/products/book-viewer";
import { AccessGate } from "@/components/products/product-access/access-gate";
import { usePreloadedProductAccess } from "@/use-cases/use-preloaded-product-access";
import { api } from "@convex/_generated/api";
import { Preloaded } from "convex/react";

interface ProductPageProps {
  preloadedProduct: Preloaded<typeof api.products.getProductAndAccess>;
}

export function ProductPage({ preloadedProduct }: ProductPageProps) {
  const { product, hasAccess } = usePreloadedProductAccess(preloadedProduct);

  console.log("product", product);
  console.log("hasAccess", hasAccess);

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
        {product.type === "book" && (
          <BookViewer bookSlug={product.slug} hasFullAccess={hasAccess} />
        )}
      </AccessGate>
    </div>
  );
}
