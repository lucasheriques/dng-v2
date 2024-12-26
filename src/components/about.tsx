import { HighlightedText } from "@/components/highlighted-text";
import { Badge } from "@/components/ui/badge";
import { getArticles } from "@/use-cases/get-articles";
import { ConciergeBell, ListCheck, SearchIcon } from "lucide-react";

const stats = [
  { label: "artigos publicados", value: `${getArticles().length}` },
  { label: "mentorias realizadas", value: "25+" },
  { label: "visitantes todo mês", value: "18.000+" },
];

export default function About() {
  return (
    <div className="relative isolate overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="absolute -top-80 left-[max(6rem,33%)] -z-10 transform-gpu blur-3xl sm:left-1/2 md:top-20 lg:ml-20 xl:top-3 xl:ml-56"
      >
        <div
          style={{
            clipPath:
              "polygon(63.1% 29.6%, 100% 17.2%, 76.7% 3.1%, 48.4% 0.1%, 44.6% 4.8%, 54.5% 25.4%, 59.8% 49.1%, 55.3% 57.9%, 44.5% 57.3%, 27.8% 48%, 35.1% 81.6%, 0% 97.8%, 39.3% 100%, 35.3% 81.5%, 97.2% 52.8%, 63.1% 29.6%)",
          }}
          className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
        />
      </div>
      <div className="content-wrapper">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <Badge className="text-sm" variant="outline">
            Não vou desperdiçar seu tempo por aqui
          </Badge>
          <h1 className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Conteúdo que faz sentido
          </h1>
          <p className="mt-6 text-xl/8 text-white/70">
            Meu primeiro trabalho como Software Developer foi em 2016. E, desde
            2020, estou sempre trabalhando pra empresas gringas.
          </p>
        </div>
        <div className="mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-10 lg:max-w-none lg:grid-cols-12">
          <div className="relative lg:order-last lg:col-span-5">
            <svg
              aria-hidden="true"
              className="absolute -top-[40rem] left-1 -z-10 h-[64rem] w-[175.5rem] -translate-x-1/2 stroke-white/10 [mask-image:radial-gradient(64rem_64rem_at_111.5rem_0%,white,transparent)]"
            >
              <defs>
                <pattern
                  id="e87443c8-56e4-4c20-9111-55b82fa704e3"
                  width={200}
                  height={200}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M0.5 0V200M200 0.5L0 0.499983" />
                </pattern>
              </defs>
              <rect
                fill="url(#e87443c8-56e4-4c20-9111-55b82fa704e3)"
                width="100%"
                height="100%"
                strokeWidth={0}
              />
            </svg>

            <div className="lg:flex lg:flex-auto lg:justify-center border-l border-rose-400/30 pl-8">
              <dl className="w-64 space-y-8 xl:w-80">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col-reverse gap-y-4"
                  >
                    <dt className="text-base/7 text-white/60">{stat.label}</dt>
                    <dd className="text-5xl font-semibold tracking-tight text-white">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="max-w-xl text-base/7 text-white/70 lg:col-span-7">
            <p>Todo o conteúdo que eu faço é pensando nesses três itens:</p>
            <ul role="list" className="mt-8 max-w-xl space-y-8 text-white/70">
              <li className="flex gap-x-3">
                <SearchIcon
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 flex-none text-primary motion-preset-pulse motion-duration-[3s]"
                />
                <span>
                  <HighlightedText className="font-semibold text-white ">
                    Pesquisável
                  </HighlightedText>{" "}
                  Meu conteúdo é composto primariamente de artigos e imagens. O
                  motivo é que eu quero que ele seja acessível: você pode
                  resumir ele usando o ChatGPT, encontrar ele usando o Google, e
                  usar ele de referência sempre que quiser.
                </span>
              </li>
              <li className="flex gap-x-3">
                <ListCheck
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 flex-none text-primary motion-preset-stretch motion-duration-[1s]"
                />
                <span>
                  <HighlightedText
                    className="font-semibold text-white px-1 rounded"
                    bgColor="bg-lime-400/60"
                  >
                    Conciso
                  </HighlightedText>{" "}
                  Meu conteúdo é conciso e direto ao ponto. Gasto 5-10h por
                  artigo entre pesquisa, escrita e revisão. E publico apenas o
                  que é mais importante para que você se torne um(a) melhor
                  profissional.
                </span>
              </li>
              <li className="flex gap-x-3">
                <ConciergeBell
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 flex-none text-primary motion-preset-seesaw"
                />
                <span>
                  <HighlightedText
                    className="font-semibold text-white px-1 rounded"
                    bgColor="bg-rose-600/60"
                  >
                    Feito sob medida
                  </HighlightedText>{" "}
                  Eu trabalho em tempo integral como engenheiro de software. E
                  só vou publicar conteúdos que eu tenha experiência prática, ou
                  que eu considere que vai ser útil para você (e pra mim
                  também).
                </span>
              </li>
            </ul>
            <p className="mt-8">
              Você não vai encontrar aqui conteúdo que seja difícil de pesquisar
              ou consumir. Ou, pior ainda, que tente apenas te vender uma
              promessa vazia.
            </p>
            <h2 className="mt-16 text-2xl font-bold tracking-tight text-white">
              Por que eu faço isso?
            </h2>
            <p className="mt-6">
              Eu tive um pouco de sorte. Achei na Engenharia de Software algo
              que realmente gosto e tenho paixão por compartilhar.{" "}
            </p>
            <p className="mt-6 text-primary font-bold">
              Meu sonho é que o Dev na Gringa se torne uma referência para tudo
              relacionado a engenharia de software e carreira internacional.
            </p>
            <p className="mt-6">
              Aqui em baixo você pode conferir um pouco da história. E esse é só
              o começo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
