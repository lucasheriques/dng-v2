import Features from "@/app/components/features";
import Hero from "@/app/components/hero";
import Timeline from "@/app/components/timeline";
import About from "@/components/about";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import HeroImage from "@public/hero.webp";
import YtThumbnail from "@public/thumb-yt.jpg";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="relative min-h-[75dvh] pt-8 md:pt-0 flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={HeroImage}
            alt="Mapa mundi artístico com Brasil em destaque"
            fill
            className="object-cover opacity-90 pointer-events-none select-none motion-duration-1500 motion-scale-in-[0.4] motion-opacity-in-[10%] motion-blur-in-[30px] motion-ease-spring-bouncy"
            priority
            placeholder="blur"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0118] via-[#0A0118]/50 to-transparent" />
        </div>
        <Hero />
      </div>
      <div
        className="content-wrapper motion-preset-fade motion-preset-slide-up motion-duration-1500 motion-delay- md:max-w-3xl md:mx-auto md:px-0 py-8"
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
      <Timeline />
    </>
  );
}
