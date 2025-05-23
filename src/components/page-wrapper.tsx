import { cn } from "@/lib/utils";

export function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "container py-4 md:py-8 flex flex-col gap-2 md:gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}
