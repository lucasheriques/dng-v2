import Features from "@/app/components/features";
import Hero from "@/app/components/hero";
import Timeline from "@/app/components/timeline";
import About from "@/components/about";
import Image from "next/image";
import HeroImage from "../../public/hero.webp";

export default function Home() {
  return (
    <>
      <div className="relative min-h-[85dvh] pt-24 flex items-center">
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

      <Features />
      <About />
      <Timeline />
    </>
  );
}
