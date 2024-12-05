import { SignIn } from "@/components/auth/sign-in-form";
import HeroImageGradientOverlay from "@/components/hero-image-gradient-overlay";
import Image from "next/image";
import Link from "next/link";
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
      <div className="z-10 flex flex-col p-8 rounded-xl backdrop-blur-sm bg-black/40 border border-white/10 shadow-lg min-h-[384px] w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8">
          <Image src={DngLogo} alt="Dev na Gringa" width={48} height={48} />
          <h1 className="text-2xl font-bold text-white/90">Dev na Gringa</h1>
        </div>
        <div className="flex-1 flex items-center">
          <SignIn />
        </div>
        <div className="text-center mt-8 text-xs">
          Ao entrar, você concorda com nossa{" "}
          <Link
            href="/politica-de-privacidade"
            className="border-b border-slate-600 hover:border-b-2 focus:outline-none"
          >
            Política de Privacidade
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
