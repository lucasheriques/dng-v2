import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { ProductPage } from "./client-page";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  // Await the params to get the slug
  const { slug } = await params;

  // Preload the product query during SSR
  const preloadedProduct = await preloadQuery(
    api.products.getProductAndAccess,
    { slug },
    {
      token: await convexAuthNextjsToken(),
    }
  );

  return <ProductPage preloadedProduct={preloadedProduct} />;
}
