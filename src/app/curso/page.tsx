import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { getContent } from "@/use-cases/get-content";
import { MDXRemote } from "next-mdx-remote/rsc";

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
