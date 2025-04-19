import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

import HeroImageGradientOverlay from "@/components/hero-image-gradient-overlay";
import { SearchButton } from "@/components/search-button";
import Image404 from "@public/404-v2.webp";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <HeroImageGradientOverlay>
        <Image
          src={Image404}
          alt="Cosmic cat in a crescent bowl"
          className="h-full w-full object-cover pointer-events-none select-none"
          priority
          placeholder="blur"
        />
      </HeroImageGradientOverlay>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen mx-auto max-w-7xl px-4 flex-col items-center justify-center sm:items-start sm:px-8">
        <div className="">
          <h1 className="mb-4 text-7xl font-bold sm:text-8xl">
            <span className="bg-linear-to-r from-pink-500 to-teal-500 bg-clip-text text-transparent">
              404
            </span>
          </h1>
          <h2 className="mb-4 text-3xl font-semibold sm:text-4xl">
            Página não encontrada
          </h2>
          <p className="mb-8 text-lg text-secondary-text">
            Oops! Parece que esta página foi transportada para outro universo.
          </p>
          <div className="flex gap-4">
            <SearchButton />
            <Link href="/">
              <Button variant="ghost">Voltar para a página inicial</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
