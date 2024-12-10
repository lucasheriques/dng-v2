import { SignIn } from "@/components/auth/sign-in-form";
import HeroImageGradientOverlay from "@/components/hero-image-gradient-overlay";
import { SOCIALS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import HeroImage from "../../../public/login-bg-hq.webp";
import DngLogo from "../../../public/logo-no-bg-small.webp";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-4 min-h-dvh items-center justify-center">
      <HeroImageGradientOverlay>
        <Image
          src={HeroImage}
          alt="Cidade futurística representando a comunidade Dev na Gringa"
          fill
          className="h-full w-full object-cover pointer-events-none select-none"
          priority
          placeholder="blur"
        />
      </HeroImageGradientOverlay>
      <div className="z-10 flex flex-col justify-between p-4 pt-8 rounded-xl backdrop-blur-sm bg-black/40 border border-white/10 shadow-lg gap-16 w-full max-w-[95%] md:max-w-md ">
        <div className="flex items-center gap-2 flex-col justify-center">
          <Image src={DngLogo} alt="Dev na Gringa" width={64} height={64} />
          <Balancer>
            <p className="text-base text-center">
              Use o mesmo email que você assinou a{" "}
              <a
                href={SOCIALS.newsletter}
                className="border-b border-slate-600 hover:border-b-2 focus:outline-none"
              >
                newsletter
              </a>
            </p>
          </Balancer>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <SignIn />
        </div>
        <div className="text-center text-xs text-muted-foreground">
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
