export function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`content-wrapper pt-24 pb-20 ${className}`}>{children}</div>
  );
}
