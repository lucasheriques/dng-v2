"use client";
import { ArticleCard } from "@/components/article-card";
import { ExpandableCard } from "@/components/expandable-card";
import { MentorshipSection } from "@/components/mentorship-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { POPULAR_ARTICLES, SOCIALS } from "@/lib/constants";
import { MotionValue, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  date?: string;
  content: React.ReactNode;
}

const data: TimelineEntry[] = [
  {
    title: "Newsletter",
    date: "Maio 2024",
    content: (
      <div className="space-y-8">
        <div className="prose dark:prose-invert">
          <p>Tudo começou com a newsletter.</p>
          <p>
            Apesar de texto não ser tão popular no Brasil quanto outros
            conteúdos visuais (vídeos, fotos, etc), eu acho que é uma ferramenta
            muito poderosa para compartilhar conhecimento
          </p>
          <p>
            A maior parte desses artigos serão de graça, pra sempre. Pois o meu
            objetivo é aprender cada vez mais para repassar todo meu
            conhecimento.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {POPULAR_ARTICLES.map((article, index) => (
            <ArticleCard
              key={index}
              title={article.title}
              description={article.description}
              link={article.link}
              readingTime={article.readingTime}
              views={article.views}
            />
          ))}
        </div>
        <Button className="w-full md:w-auto min-w-64" variant="outline" asChild>
          <Link
            href={`${SOCIALS.newsletter}/subscribe?ref=nagringa.dev`}
            className="flex items-center"
          >
            Receba os artigos toda semana
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    ),
  },
  {
    title: "Mentoria",
    date: "Junho 2024",
    content: <MentorshipSection newsletterUrl={SOCIALS.newsletter} />,
  },
  {
    title: "Depoimentos",
    date: "Novembro 2024",
    content: (
      <div>
        <div className="prose dark:prose-invert mb-8">
          <p>E aqui vem a parte mais gratificante.</p>
          <p>
            Ver como as pessoas estão evoluindo, e como a comunidade e o meu
            conteúdo está impactando a vida das pessoas que me cederam sua
            confiança.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExpandableCard
            title="Mentoria individual"
            summary="Essa mentoria com o Lucas foi um achado viu. O cara é uma
                    referência técnica gigante e uma fonte de energia para quem
                    deseja crescer na área."
            fullContent={
              <div className="prose dark:prose-invert">
                <p>O Lucas é um mentor muito prático e direto ao ponto.</p>
                <p>
                  Ele procura entender meus objetivos antes de me orientar, dá
                  feedback personalizado e ajuda a organizar minhas metas.
                </p>
                <p>
                  Tenho conseguido identificar melhor os meus GAP&apos;s
                  técnicos(sem medo de julgamentos) e estou melhorando a gestão
                  da minha agenda de estudos e desenvolvimento técnico,
                  conciliando bem com a progressão profissional que eu almejo.
                </p>
                <p>
                  Além do mais, o Lucas inspira a gente pela própria prática
                  sabe: ele cria e compartilha novos projetos e ideias com a
                  comunidade, o que acaba motivando a gente a buscar o mesmo
                  nível de inovação e comprometimento.
                </p>
                <p>
                  <strong>
                    Essa mentoria com o Lucas foi um achado viu. O cara é uma
                    referência técnica gigante e uma fonte de energia para quem
                    deseja crescer na área.
                  </strong>
                </p>
              </div>
            }
            footer={
              <Link
                href="https://www.linkedin.com/in/daianegalvao/"
                target="_blank"
                className="flex items-center space-x-4"
              >
                <Avatar>
                  <AvatarImage src="/reviews/daiane.webp" alt="Daiane Galvão" />
                  <AvatarFallback>DG</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">Daiane Galvão</p>
                  <p className="text-sm text-white/60">
                    Senior Software Engineer @ Hotmart
                  </p>
                </div>
              </Link>
            }
          />
          <ExpandableCard
            title="Mentoria em grupo"
            summary="Meu campo de visão era bem restrito, mas os artigos e mentorias do Lucas me ajudaram a expandi-lo, tanto em aspectos técnicos quanto em questões sociais e de comunicação."
            fullContent={
              <div className="prose dark:prose-invert">
                <p>
                  Conheci o Lucas através de um dos primeiros artigos dele. Já
                  estava trabalhando no exterior e me identifiquei muito com os
                  temas que ele abordava, especificamente quando ele aborda
                  sobre as algemas de ouro - aquilo mexeu muito comigo, pois na
                  época já vinha me sentindo desconfortável com o rumo que minha
                  carreira como dev estava tomando.
                </p>
                <p>
                  Me sentia muito parado no tempo e acomodado. Depois disso,
                  assinei e comecei a acompanhar a newsletter, e desde então
                  tenho aprendido bastante. Consegui entender os pontos que eu
                  precisava melhorar para sair da minha zona de conforto.
                </p>
                <p>
                  Durante as mentorias e todo o material que o Lucas fornece,
                  aprendi tudo que eu precisava melhorar: minha comunicação,
                  minha postura em redes sociais como LinkedIn, leetcode, system
                  designs, como me comportar em diferentes etapas de uma
                  entrevista. Tudo isso naturalmente está fazendo eu melhorar a
                  cada dia e agora estou de fato enxergando um novo sentido na
                  minha carreira como dev.
                </p>
                <p>
                  Não apenas os artigos e mentorias, mas sempre conversamos por
                  mensagem todos os dias, onde recebo conselhos técnicos,
                  discutimos sobre alguma empresa em específico, um problema
                  técnico, qualquer coisa, inclusive às vezes assuntos da vida.
                </p>
                <p>
                  Acredito que isso seja um grande diferencial em sua mentoria -
                  é como criar uma relação de amizade onde vocês podem trocar
                  experiências o tempo todo, com todos os membros da comunidade.
                </p>
              </div>
            }
            footer={
              <Link
                href="https://www.linkedin.com/in/matusca96/"
                target="_blank"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src="/reviews/matheus.webp"
                      alt="Matheus Gomes"
                    />
                    <AvatarFallback>MG</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-white">Matheus Gomes</p>
                    <p className="text-sm text-white/60">
                      Technical Lead @ MoOngy
                    </p>
                  </div>
                </div>
              </Link>
            }
          />
          <ExpandableCard
            title="Mentoria em grupo"
            summary="[...] encontrei um post do Lucas sobre o seu blog Dev
                  na Gringa. Como estava atrás de informação, fui ler as
                  notícias, me inscrevi na newsletter, e acabei entrando na
                  comunidade dele, onde tem outros desenvolvedores também na
                  mesma procura. Foi a melhor decisão que eu tomei nesse tempo
                  todo."
            fullContent={
              <div className="prose dark:prose-invert">
                <p>
                  Eu fiquei aproximadamente 1 ano em busca de uma melhora
                  salarial. Fui aos poucos me aprimorando, estudando, tentando
                  várias iterações do meu currículo e explorando diversas
                  plataformas de emprego na tentativa de mudar de posição e
                  progredir na carreira.
                </p>
                <p>
                  Um dia, fui atrás de informações no r/brdev para ver questões
                  de mercado, porque já fazia tanto tempo que eu estava à
                  procura que eu queria saber se meus interesses que estavam
                  muito fora do preço de mercado.
                </p>
                <p>
                  Foi lá que eu encontrei um post do Lucas sobre o seu blog Dev
                  na Gringa. Como estava atrás de informação, fui ler as
                  notícias, me inscrevi na newsletter, e acabei entrando na
                  comunidade dele, onde tem outros desenvolvedores também na
                  mesma procura. Foi a melhor decisão que eu tomei nesse tempo
                  todo.
                </p>
                <p>
                  Claro que tudo que estudei antes fez muita diferença. Mas
                  tinha uma coisa que me barrava direto nas vagas: A avaliação
                  de currículo. Estar junto com outras pessoas com o mesmo
                  interesse, podendo compartilhar experiências, e, mais
                  importante de tudo, tendo alguém mais experiente para indicar
                  quais são os pontos mais críticos de melhora foi extremamente
                  benéfico.
                </p>
                <p>
                  No mês seguinte a eu me inscrever na newsletter e entrar na
                  comunidade, eu consegui 6 entrevistas.{" "}
                  <strong>
                    Para quem estava a 10 meses procurando vaga, eu atribuo à
                    ajuda do Lucas o sucesso na reta final, pois foi muito
                    rápido o impacto após a entrada e os ajustes de currículo
                    com os conselhos dele.
                  </strong>{" "}
                  Com isso, eu consegui avançar em diversos processos e, em 40
                  dias, atingir uma oferta que estava na minha expectativa
                  salarial. Ou seja, eu não estava com expectativas surreais,
                  mas me faltava algo.
                </p>
              </div>
            }
            footer={
              <Link
                href="https://www.linkedin.com/in/lorenzo-santos-correa/"
                target="_blank"
                className="flex items-center space-x-4"
              >
                <Avatar>
                  <AvatarImage
                    src="/reviews/lorenzo.jpeg"
                    alt="Lorenzo Corrêa"
                  />
                  <AvatarFallback>LC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">Lorenzo Corrêa</p>
                  <p className="text-sm text-white/60">
                    Software Developer @ MOST Specialist Technologies
                  </p>
                </div>
              </Link>
            }
          />
          <ExpandableCard
            title="Mentoria em grupo"
            summary="Sou profundamente grato ao Lucas por criar um espaço tão autêntico e por ser um mentor que acredita no potencial de cada membro. E também à comunidade, que perpetua esse legado ao compartilhar suas experiências e apoiar uns aos outros. Juntos, estamos construindo algo grande."
            fullContent={
              <div className="prose dark:prose-invert">
                <p>
                  Minha jornada na Dev na Gringa ainda está no meio do caminho,
                  mas já posso dizer que tem sido profundamente transformadora.
                  Conheci o Lucas Faria por meio de uma publicação no LinkedIn
                  que dizia &ldquo;Create the things you wish existed&rdquo;. A
                  autenticidade com que ele se posiciona e fala sobre trabalhar
                  para empresas internacionais, aprendizado contínuo e
                  estratégias de mercado me inspirou profundamente. Era como se
                  ele tivesse traduzido exatamente o que eu buscava: uma mudança
                  de carreira, a oportunidade de trabalhar no exterior e a
                  chance de fazer parte de algo maior. Sem hesitar, assinei a
                  newsletter – o primeiro de muitos passos rumo a uma nova
                  perspectiva de vida.
                </p>
                <p>
                  Desde que entrei na comunidade, venho participando dos
                  encontros mensais, explorando os materiais exclusivos e
                  aplicando os ensinamentos do Lucas para acelerar minha
                  transição de carreira. Estou aprendendo a me posicionar de
                  forma mais estratégica, ajustar minha comunicação e encarar
                  entrevistas com mais segurança e confiança. O Lucas vai além
                  de oferecer conteúdo técnico, ele traz orientações práticas e
                  estratégias que realmente fazem a diferença. Ele não entrega
                  respostas prontas, mas ensina como encontrar o nosso próprio
                  caminho, sempre respeitando o momento e os objetivos de cada
                  um.
                </p>
                <p>
                  O acompanhamento próximo que ele oferece e o ambiente
                  colaborativo da comunidade são os grandes diferenciais. Seja
                  por meio de conselhos personalizados ou dos encontros em
                  grupo, o Lucas está sempre presente – incentivando, corrigindo
                  o curso quando necessário e compartilhando insights valiosos.
                  E a comunidade? É um espaço único, repleto de pessoas que
                  compartilham experiências, superam desafios e se apoiam
                  mutuamente em busca de crescimento. Estar cercado de pessoas
                  com os mesmos objetivos e comprometidas a entregar o melhor de
                  si tem sido essencial nessa jornada.
                </p>
                <p>
                  Embora ainda esteja no meio do caminho, já consigo enxergar o
                  quanto evoluí pessoal e profissionalmente desde que comecei.
                  Estou me dedicando ao máximo para aproveitar cada recurso,
                  cada conselho e cada oportunidade que a Dev na Gringa
                  proporciona. Hoje, posso afirmar com segurança que entrar para
                  essa comunidade foi uma das melhores decisões que tomei. Não é
                  apenas um espaço para aprender – é um lugar para compartilhar,
                  se conectar, se inspirar e encontrar a motivação para alcançar
                  o que antes parecia fora do alcance.
                </p>
                <p>
                  Sou profundamente grato ao Lucas por criar um espaço tão
                  autêntico e por ser um mentor que acredita no potencial de
                  cada membro. E também à comunidade, que perpetua esse legado
                  ao compartilhar suas experiências e apoiar uns aos outros.
                  Juntos, estamos construindo algo grande.
                </p>
              </div>
            }
            footer={
              <Link
                href="https://www.linkedin.com/in/gabriel-ob-viana/"
                target="_blank"
                className="flex items-center space-x-4"
              >
                <Avatar>
                  <AvatarImage
                    src="/reviews/gabriel.webp"
                    alt="Gabriel Viana"
                  />
                  <AvatarFallback>GC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">Gabriel Viana</p>
                  <p className="text-sm text-white/60">Senior Data Analyst</p>
                </div>
              </Link>
            }
          />
          <ExpandableCard
            title="Mentoria individual"
            summary={
              <>
                Se você está considerando investir em si mesmo, posso afirmar
                com certeza: essa mentoria é mais do que um curso ou um guia — é
                um verdadeiro <strong>divisor de águas</strong>.
              </>
            }
            fullContent={
              <div className="prose dark:prose-invert">
                <p>
                  Após cerca de quatro meses de mentoria, é o momento de
                  refletir sobre tudo que aprendi e vivenciei até aqui. Antes de
                  mais nada, percebi que existem três tipos de mentoria:
                </p>
                <ul>
                  <li>
                    A primeira: aquela que, no início, não oferece nada de
                    concreto. Promete mundos e fundos, mas depois que você paga,
                    entrega apenas migalhas.
                  </li>
                  <li>
                    A segunda: a que até apresenta algumas coisas interessantes
                    de graça, promete muito, mas, no final, também deixa a
                    desejar após o pagamento.
                  </li>
                  <li>
                    E a terceira, a melhor de todas: aquela que, desde o começo,
                    te apresenta uma imensa variedade de conteúdo gratuito, te
                    integra à comunidade, e só depois te convida para a mentoria
                    paga. A diferença? Após o investimento, o conteúdo se torna
                    ainda mais completo, sua visão se expande e cada reunião é
                    uma oportunidade de aprendizado. Não é conduzida por alguém
                    formal e distante, mas por uma figura amigável, que
                    realmente se importa em te ajudar. Ele não dá respostas
                    prontas, mas te guia para enxergar seus pontos fracos,
                    quebrar os problemas em pedaços e encontrar as soluções
                    junto com você.
                  </li>
                </ul>
                <p>E é exatamente aí que a mentoria do Lucas se encaixa!</p>
                <p>
                  Minha jornada começou quando encontrei o Lucas por meio de um
                  artigo no TabNews. Curioso, entrei no Discord da comunidade e
                  percebi que fui o segundo a entrar. Vasculhando o servidor, vi
                  um canal de voz dedicado a treino de inglês. Empolgado com o
                  que tinha encontrado, comentei sobre isso, e o Lucas, para
                  minha surpresa, marcou uma call de treino para a quinta-feira
                  seguinte. Achei incrível o jeito que ele abordou a situação,
                  fazendo parecer algo importante e especial. Eu só havia
                  mencionado que vi o canal de voz, mas ele perguntou
                  diretamente sobre minha disponibilidade e organizou tudo.
                </p>
                <p>
                  Posteriormente, descobri a mentoria por meio da página na
                  Substack. Inicialmente, não consegui realizar o pagamento
                  porque nenhuma das formas era compatível comigo. Conversei com
                  ele, e o Lucas foi flexível para encontrar uma solução.
                </p>
                <p>
                  Até hoje, mesmo com o crescimento da comunidade e a chegada de
                  muitas outras pessoas, continuo me sentindo totalmente
                  incluído. Mesmo sem ter a mesma bagagem técnica de outros, ele
                  sempre encontra uma maneira de me ajudar e me fazer entender o
                  que acontece por lá.
                </p>
                <p>
                  Admiro muito a praticidade com que as coisas são feitas na
                  comunidade. Desde a ilustração de conceitos, que ele sempre
                  faz de forma muito visual durante as calls para facilitar
                  nosso entendimento, até os resumos das reuniões, que nos
                  ajudam a lembrar exatamente dos pontos mais importantes. A
                  organização dos canais, tanto no Discord quanto no WhatsApp,
                  também é algo que me impressiona.
                </p>
                <p>
                  Se você está considerando investir em si mesmo, posso afirmar
                  com certeza: essa mentoria é mais do que um curso ou um guia —
                  é um verdadeiro <strong>divisor de águas</strong>.
                </p>
              </div>
            }
            footer={
              <Link
                href="https://www.linkedin.com/in/gustavo-almeida-bb1088264/"
                target="_blank"
                className="flex items-center space-x-4"
              >
                <Avatar>
                  <AvatarImage
                    src="/reviews/gustavo.webp"
                    alt="Gustavo Almeida"
                  />
                  <AvatarFallback>GC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">Gustavo Almeida</p>
                  <p className="text-sm text-white/60">Fullstack Developer</p>
                </div>
              </Link>
            }
          />
        </div>
      </div>
    ),
  },
];

const TimelineCircle = ({
  scrollYProgress,
  index,
  total,
}: {
  scrollYProgress: MotionValue<number>;
  index: number;
  total: number;
}) => {
  const circleTransform = useTransform(
    scrollYProgress,
    [index / total, (index + 0.1) / total],
    ["rgb(229 229 229)", "#ff4d8e"]
  );

  const circleScale = useTransform(
    scrollYProgress,
    [index / total, (index + 0.1) / total],
    [1, 1.2]
  );

  return (
    <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-gradient-to-br from-white/10 to-white/5 dark:from-white/5 dark:to-transparent backdrop-blur-sm flex items-center justify-center shadow-lg">
      <motion.div
        className="h-6 w-6 rounded-full border-2 border-neutral-200/40 dark:border-neutral-700/40 flex items-center justify-center"
        style={{
          scale: circleScale,
          background: circleTransform,
          boxShadow: "0 0 10px rgba(59, 130, 246, 0.3)",
        }}
      >
        <motion.div
          className="h-2 w-2 rounded-full bg-white dark:bg-white/90"
          style={{
            scale: circleScale,
          }}
        />
      </motion.div>
    </div>
  );
};

const Timeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-slate-950 md:px-10" ref={containerRef}>
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:gap-10">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <TimelineCircle
                scrollYProgress={scrollYProgress}
                index={index}
                total={data.length}
              />
              <div className="hidden md:block md:pl-20">
                <h3 className="text-xl md:text-5xl font-bold text-neutral-500 dark:text-neutral-400">
                  {item.title}
                </h3>
                {item.date && (
                  <span className="text-sm text-neutral-400">{item.date}</span>
                )}
              </div>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <div className="md:hidden block mb-4 text-left">
                <h3 className="text-2xl font-bold text-neutral-500 dark:text-neutral-400">
                  {item.title}
                </h3>
                {item.date && (
                  <span className="text-sm text-neutral-400">{item.date}</span>
                )}
              </div>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-accent-secondary via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
