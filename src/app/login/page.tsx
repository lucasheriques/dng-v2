import { SignInFormEmailLink } from "@/components/auth/sign-in-form";
import HeroImageGradientOverlay from "@/components/hero-image-gradient-overlay";
import Image from "next/image";
import DngLogo from "../../../public/dng-small.webp";
import HeroImage from "../../../public/login-bg-hq.webp";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-4 min-h-dvh items-center justify-center">
      <HeroImageGradientOverlay>
        <Image
          src={HeroImage}
          alt="Mapa mundi artístico com Brasil em destaque"
          fill
          className="h-full w-full object-cover pointer-events-none select-none"
          priority
          placeholder="blur"
        />
      </HeroImageGradientOverlay>
      <div className="z-10 flex flex-col gap-4 items-center justify-center p-8 rounded-xl backdrop-blur-sm bg-black/40 border border-white/10 shadow-lg min-h-[384px]">
        <Image src={DngLogo} alt="Dev na Gringa" width={48} height={48} />
        <h1 className="text-2xl font-bold text-white/90">Dev na Gringa</h1>
        <SignInFormEmailLink />
      </div>
    </div>
  );
}