import Hero from "@/app/components/hero";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import { getMostPopularArticles } from "@/use-cases/get-articles";
import HeroImage from "@public/hero.webp";
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
