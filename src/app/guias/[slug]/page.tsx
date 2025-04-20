import { ProductPage } from "@/app/guias/[slug]/client-page";
import { getContent } from "@/use-cases/get-content";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { MDXRemote } from "next-mdx-remote/rsc";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  // Await the params to get the slug
  const { slug } = await params;

  const content = await getContent(`${slug}/01.mdx`);

  // Preload the product query during SSR
  const preloadedProduct = await preloadQuery(
    api.products.getProductAndAccess,
    { slug },
    {
      token: await convexAuthNextjsToken(),
    }
  );

  return (
    <ProductPage
      preloadedProduct={preloadedProduct}
      content={
        <article className="prose prose-slate dark:prose-invert">
          <MDXRemote source={content} />
        </article>
      }
    />
  );
}
