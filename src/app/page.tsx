import Hero from "@/app/components/hero";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import { getMostPopularArticles } from "@/use-cases/get-articles";
import HeroImage from "@public/hero.webp";
import AmazonLogo from "@public/logos/amazon.svg";
import BrexLogo from "@public/logos/brex.svg";
import GoogleLogo from "@public/logos/google.svg";
import MicrosoftLogo from "@public/logos/microsoft.svg";
import NubankLogo from "@public/logos/nubank.svg";
import PostHogLogo from "@public/logos/posthog.svg";
import YtThumbnail from "@public/thumb-yt.jpg";
import dynamic from "next/dynamic";
import Image from "next/image";

const Features = dynamic(() => import("@/app/components/features"));
const About = dynamic(() => import("@/components/about"));
const Timeline = dynamic(() => import("@/app/components/timeline"));

export default async function Home() {
  const topFourMostPopularArticles = getMostPopularArticles().slice(0, 4);

  return (
    <div className="pb-16">
      <div className="relative min-h-[75dvh] pt-8 md:pt-0 flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={HeroImage}
            alt="Mapa mundi artístico com Brasil em destaque"
            fill
            className="object-cover opacity-90 pointer-events-none select-none motion-duration-700 motion-scale-in-[0.4] motion-opacity-in-[10%] motion-blur-in-[30px] motion-ease-spring-smooth"
            priority
            placeholder="blur"
            sizes="1v"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0118] via-[#0A0118]/50 to-transparent" />
        </div>
        <Hero />
      </div>
      <div className="container space-y-4 py-12">
        <h2 className="text-lg/8 font-semibold">
          A newsletter lida por pessoas que trabalham nessas empresas:
        </h2>
        <div className="">
          <div className="grid grid-cols-2 gap-0.5 overflow-hidden md:rounded-2xl md:grid-cols-3 lg:grid-cols-6">
            <div className="bg-white/5 p-6 md:p-10 flex items-center justify-center text-white">
              <Image
                width={32}
                height={32}
                unoptimized
                alt="Microsoft"
                src={MicrosoftLogo.src}
                className="h-8 min-w-full object-contain hover:scale-115 transition-all duration-300"
              />
            </div>
            <div className="bg-white/5 p-6 md:p-10 flex items-center justify-center">
              <Image
                width={32}
                height={32}
                unoptimized
                alt="Google"
                src={GoogleLogo.src}
                className="h-8 min-w-full object-contain hover:scale-115 transition-all duration-300"
              />
            </div>
            <div className="bg-white/5 p-6 md:p-10 flex items-center justify-center">
              <Image
                width={32}
                height={32}
                unoptimized
                alt="Brex"
                src={BrexLogo.src}
                className="h-8 min-w-full object-contain hover:scale-115 transition-all duration-300"
              />
            </div>
            <div className="bg-white/5 p-6 md:p-10 flex items-center justify-center">
              <Image
                width={32}
                height={32}
                unoptimized
                alt="PostHog"
                src={PostHogLogo.src}
                className="h-8 min-w-full object-contain hover:scale-115 transition-all duration-300"
              />
            </div>
            <div className="bg-white/5 p-6 md:p-10 flex items-center justify-center">
              <Image
                width={32}
                height={32}
                unoptimized
                alt="Amazon"
                src={AmazonLogo.src}
                className="h-8 min-w-full object-contain hover:scale-115 transition-all duration-300"
              />
            </div>
            <div className="bg-white/5 p-6 md:p-10 flex items-center justify-center">
              <Image
                width={32}
                height={32}
                unoptimized
                alt="Nubank"
                src={NubankLogo.src}
                className="h-8 min-w-full object-contain hover:scale-115 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="motion-preset-fade motion-preset-slide-up motion-duration-1500 motion-delay- md:max-w-3xl md:mx-auto md:px-0 py-8"
        id="youtube-hero"
      >
        <HeroVideoDialog
          animationStyle="top-in-bottom-out"
          videoSrc="https://www.youtube.com/embed/HkDNy_PMg5A"
          thumbnailSrc={YtThumbnail}
          thumbnailAlt="O que é o Dev na Gringa e como minha jornada de criação de conteúdo começou"
        />
      </div>
      <Features />
      <About />
      <Timeline articles={topFourMostPopularArticles} />
    </div>
  );
}
