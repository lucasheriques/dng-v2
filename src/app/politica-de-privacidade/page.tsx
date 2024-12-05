import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";

import { PageWrapper } from "@/components/page-wrapper";
import { getContent } from "@/use-cases/get-content";

export const metadata: Metadata = {
  title: `Política de Privacidade | Dev na Gringa`,
  description: "Política de Privacidade do Dev na Gringa",
};

export default async function PrivacyPolicy() {
  const content = await getContent("politica-de-privacidade.mdx");
  return (
    <PageWrapper>
      <article className="prose max-w-full text-lg dark:prose-invert">
        <MDXRemote source={content} />
      </article>
    </PageWrapper>
  );
}
