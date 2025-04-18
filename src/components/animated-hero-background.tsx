export function AnimatedHeroBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden">
        {children}
        <div className="absolute inset-0 bg-linear-to-t from-[#0A0118] via-[#0A0118]/50 to-transparent" />
      </div>
    </>
  );
}
