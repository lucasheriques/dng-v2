import { HighlightedText } from "@/components/highlighted-text";
import CommunityImage from "@public/community.webp";
import { ChartNoAxesCombined, Network, Newspaper } from "lucide-react";
import Image from "next/image";

const features = [
  {
    name: "Comunidade",
    description:
      "Faça parte de uma comunidade positiva, que vai te motivar a crescer e aprender um com o outro.",
    icon: Network,
  },
  {
    name: "Conteúdo",
    description:
      "Receba conteúdos sobre carreira e engenharia de software de quem está trabalhando no mercado. Nada de vender sonhos ou fazer promessas que não podem ser cumpridas.",
    icon: Newspaper,
  },
  {
    name: "Carreira",
    description:
      "Acelere sua evolução profissional com mentorias, conteúdos de quem está trabalhando e feedback personalizado.",
    icon: ChartNoAxesCombined,
  },
];

export default function Features() {
  return (
    <div className="content-wrapper py-8 motion-preset-fade motion-preset-slide-up motion-duration-1500">
      <div className="relative isolate overflow-hidden bg-slate-900 px-6 py-20 sm:rounded-3xl sm:px-10 sm:py-24 lg:py-24 xl:px-24">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center lg:gap-y-0">
          <div className="lg:row-start-2 lg:max-w-md">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Uma <HighlightedText color="pink">comunidade</HighlightedText> que
              te ajuda a conquistar oportunidades globais e{" "}
              <HighlightedText color="primary">
                crescer profissionalmente
              </HighlightedText>
            </h2>
            <p className="mt-6 text-lg/8 text-gray-300">
              Faça parte de uma comunidade vibrante de devs brasileiros. Tenha
              acesso a conteúdo exclusivo sobre a carreira na engenharia de
              software.
            </p>
            <p className="mt-6 text-lg/8 text-gray-300">
              Seja para você que quer crescer para se tornar sênior ou staff, ou
              pra quem esteja buscando uma oportunidade no exterior.
            </p>
          </div>

          <Image
            alt="Uma imagem futurista representando uma comunidade de devs brasileiros."
            src={CommunityImage}
            width={1024}
            height={1024}
            placeholder="blur"
            className="relative -z-20 min-w-full rounded-xl shadow-xl ring-1 ring-white/10 lg:row-span-4 lg:w-[64rem] lg:max-w-none pointer-events-none select-none"
          />

          <div className="max-w-xl lg:row-start-3 lg:mt-10 lg:max-w-md lg:border-t lg:border-white/10 lg:pt-10">
            <dl className="max-w-xl space-y-8 text-base/7 text-gray-300 lg:max-w-none">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <dt className="ml-9 inline-block font-semibold text-white">
                    <feature.icon
                      aria-hidden="true"
                      className="absolute left-1 top-1 h-5 w-5 text-accent-secondary"
                    />
                    {feature.name}
                  </dt>{" "}
                  <dd className="inline">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-12 top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-3xl lg:bottom-[-12rem] lg:top-auto lg:translate-y-0 lg:transform-gpu"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="aspect-1155/678 w-[72.1875rem] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-25"
          />
        </div>
      </div>
    </div>
  );
}
