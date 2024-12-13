export function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`content-wrapper pb-20 pt-4 md:pt-8 ${className}`}>
      {children}
    </div>
  );
}
