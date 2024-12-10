import Features from "@/app/components/features";
import Hero from "@/app/components/hero";
import Timeline from "@/app/components/timeline";
import About from "@/components/about";
import { AnimatedHeroBackground } from "@/components/animated-hero-background";
import Image from "next/image";
import HeroImage from "../../public/hero.webp";

export default function Home() {
  return (
    <>
      <div className="relative min-h-[85dvh] pt-24 flex items-center">
        <AnimatedHeroBackground>
          <Image
            src={HeroImage}
            alt="Mapa mundi artístico com Brasil em destaque"
            fill
            className="object-cover opacity-90 pointer-events-none select-none"
            priority
            placeholder="blur"
          />
        </AnimatedHeroBackground>
        <Hero />
      </div>

      <Features />
      <About />
      <Timeline />
    </>
  );
}
