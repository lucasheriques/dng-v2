type Props = {
  children: React.ReactNode;
};

export default function HeroImageGradientOverlay({ children }: Props) {
  return (
    <div className="absolute inset-0">
      {children}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0118] via-[#0A0118]/50 to-transparent" />
    </div>
  );
}
