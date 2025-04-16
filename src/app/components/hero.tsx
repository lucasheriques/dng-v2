import { Button } from "@/components/ui/button";
import { SOCIALS } from "@/lib/constants";
import { ArrowRight, Rocket } from "lucide-react";
// import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";

import Stats from "@/app/components/stats";
import { cn } from "@/lib/utils";

// Company logos
// import AmazonLogo from "@public/logos/amazon.svg";
// import GoogleLogo from "@public/logos/google.svg";
// import MicrosoftLogo from "@public/logos/microsoft.svg";
// import NubankLogo from "@public/logos/nubank.svg";
// import PosthogLogo from "@public/logos/posthog.svg";

type Props = {
  text: string;
  delay?: number;
  className?: string;
};

function AnimatedText({ text, className = "" }: Props) {
  return (
    <span
      className={cn(
        "inline-block",
        "motion-opacity-in-0 motion-translate-y-in-100 motion-blur-in-md motion-delay-500",
        className
      )}
    >
      {text}
    </span>
  );
}

// const companies = [
//   { name: "Nubank", logo: NubankLogo },
//   { name: "Google", logo: GoogleLogo },
//   { name: "Microsoft", logo: MicrosoftLogo },
//   { name: "Amazon", logo: AmazonLogo },
//   { name: "PostHog", logo: PosthogLogo },
// ];

// function CompanyLogos() {
//   return (
//     <div className="w-full motion-preset-fade motion-preset-slide-up motion-duration-300 motion-delay-[1.5s]">
//       <p className="text-sm text-slate-400 mb-4">
//         Nossos leitores trabalham em empresas como:
//       </p>
//       <div className="flex flex-wrap items-center gap-x-8 gap-y-6 justify-center sm:justify-start">
//         {companies.map((company) => (
//           <div key={company.name} className="relative h-7 w-[120px] ">
//             <Image
//               src={company.logo}
//               alt={`${company.name} logo`}
//               fill
//               className="object-contain object-left"
//               sizes="120px"
//               priority
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

export default async function Hero() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 relative z-10 space-y-4 md:space-y-8">
      <div>
        <h1 className="font-bold text-white text-3xl md:text-4xl">
          <Balancer>
            <AnimatedText text="O melhor conteúdo" />
            <br />
            <AnimatedText
              text="para devs ambiciosos"
              className="bg-gradient-to-r from-primary via-yellow-400 to-accent-secondary text-transparent bg-clip-text inline-block animate-gradient text-4xl md:text-5xl"
            />
          </Balancer>
        </h1>
      </div>
      <h2 className="text-xl text-slate-200 max-w-2xl">
        <Balancer>
          <AnimatedText text="Junte-se a 2550+ devs brasileiros aprendendo, compartilhando experiências e construindo carreiras internacionais juntos." />
        </Balancer>
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 motion-preset-fade motion-preset-slide-up motion-duration-300 motion-delay-1000">
        <div className="flex flex-col gap-1">
          <Button size="xl" asChild className="min-w-80">
            <Link href={`${SOCIALS.newsletter}/subscribe?ref=nagringa.dev`}>
              Participe da mentoria
              <Rocket className="ml-2 h-5 w-5 group-hover:motion-translate-x-in-[-134%] group-hover:motion-translate-y-in-[164%] group-hover:h-8 group-hover:w-8" />
            </Link>
          </Button>
          <Link
            href="https://newsletter.nagringa.dev/p/como-funciona-a-mentoria"
            className="text-sm border-white font-medium text-center transition-colors hover:text-primary"
            target="_blank"
          >
            Como funciona a mentoria?
          </Link>
        </div>
        <Button variant="outline" size="xl" asChild className="min-w-80">
          <Link href={`${SOCIALS.newsletter}?ref=nagringa.dev`}>
            Veja minha newsletter
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
      <Stats />
    </div>
  );
}
