import { PageWrapper } from "@/components/page-wrapper";
import { ToolsSidebar } from "@/components/tools-sidebar";

export default function FerramentasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      <ToolsSidebar />
      <PageWrapper className="flex-1">
        <div className="min-h-dvh">{children}</div>
      </PageWrapper>
    </div>
  );
}
