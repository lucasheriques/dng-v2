import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { getContent } from "@/use-cases/get-content";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";

export const metadata: Metadata = {
  title: "Como virar um dev na gringa",
  description:
    "Quer virar um dev na gringa? Então venha ler isso. Direto ao ponto, sem tentar te vender um curso de 10 mil reais.",
};

export default async function Curso() {
  const content = await getContent("curso-abril.mdx");
  return (
    <PageWrapper>
      <article className="prose max-w-full text-lg dark:prose-invert">
        <MDXRemote source={content} components={{ Button: Button }} />
      </article>
    </PageWrapper>
  );
}
