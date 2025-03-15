import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { ProductPage } from "./client-page";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  // Preload the product query during SSR
  const preloadedProduct = await preloadQuery(
    api.products.getProductAndAccess,
    { slug: params.slug },
    {
      token: await convexAuthNextjsToken(),
    }
  );

  return <ProductPage preloadedProduct={preloadedProduct} />;
}
