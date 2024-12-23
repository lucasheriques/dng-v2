import { BorderBeam } from "@/components/ui/border-beam";
import { SOCIALS } from "@/lib/constants";
import {
  BookOpen,
  Network,
  Presentation,
  Target,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface MentorshipSectionProps {
  newsletterUrl: string;
}

const mentorshipItems = [
  {
    tabContent: (
      <>
        <Presentation className="h-4 w-4 mr-2 text-[#FF4B8C] group-data-[state=active]:text-primary" />
        Mentoria em Grupo
      </>
    ),
    title: "Mentoria em Grupo",
    content: (
      <section className="prose dark:prose-invert">
        <h3>Mentoria em Grupo</h3>
        <p>
          Três encontros mensais para resolver dúvidas e compartilhar
          experiências:
        </p>
        <ul>
          <li>
            Uma sessão dedicada exclusivamente para System Design, focada em
            preparação para entrevistas
          </li>
          <li>
            Duas sessões abertas para discussão de carreira, trabalho remoto,
            processos seletivos e mais
          </li>
          <li>
            Resumo de cada mentoria disponível publicamente aqui:{" "}
            <a
              href="https://mentoria.nagringa.dev"
              target="_blank"
              className="underline"
            >
              mentoria.nagringa.dev
            </a>
          </li>
        </ul>
        <p>
          Durante nossos encontros mensais, você terá a oportunidade de discutir
          desafios reais, perguntar sobre qualquer assunto relevante e aprender
          com as experiências de outros profissionais.
        </p>
        <p>
          <strong>Atenção:</strong> A mentoria em grupo é exclusiva para os{" "}
          <a
            href={`${SOCIALS.newsletter}/subscribe?ref=nagringa.dev`}
            className="underline"
            target="_blank"
          >
            assinantes pagos da newsletter.
          </a>
        </p>
      </section>
    ),
  },
  {
    tabContent: (
      <>
        <UsersRound className="h-4 w-4 mr-2 text-blue-400 group-data-[state=active]:text-primary" />
        Mentoria Individual
      </>
    ),
    title: "Mentoria Individual",
    content: (
      <section className="prose dark:prose-invert">
        <h3>Mentoria Individual</h3>
        <p>Sessões 1:1 personalizadas para os seus objetivos:</p>
        <ul>
          <li>
            Qualquer dúvida sobre entrevistas técnicas, currículo e carreira
          </li>
          <li>
            Elaboração de um plano de crescimento baseado na sua situação hoje e
            nos seus objetivos.
          </li>
          <li>
            Todas as sessões serão gravadas, resumiadas e disponibilizadas para
            você.
          </li>
        </ul>
        <p>
          Eu não posso garantir que eu vou ter todas as respostas pra você.{" "}
          <strong>
            Mas eu prometo que vou fazer o possível para te ajudar, com base na
            minha experiência real.
          </strong>
        </p>
        <p>
          Apenas 2 vagas disponíveis. Para uma sessão avulsa,{" "}
          <a
            href="https://cal.com/lucasfaria/mentoria-individual"
            className="underline"
            target="_blank"
          >
            marque por aqui.
          </a>{" "}
          Para uma sessão recorrente, com desconto no valor anual,{" "}
          <a
            href={`${SOCIALS.newsletter}/subscribe?ref=nagringa.dev`}
            className="underline"
            target="_blank"
          >
            assine o plano na newsletter.
          </a>
        </p>
      </section>
    ),
  },
  {
    tabContent: (
      <>
        <Target className="h-4 w-4 mr-2 text-yellow-400 group-data-[state=active]:text-primary" />
        Grupo de Responsabilidade
      </>
    ),
    title: "Grupo de Responsabilidade",
    content: (
      <section className="prose dark:prose-invert">
        <h3>Grupo de Responsabilidade</h3>
        <p>
          Encontros mensais para acompanhamento de metas e crescimento
          profissional:
        </p>
        <ul>
          <li>Definição e revisão mensal de objetivos claros e alcançáveis</li>
          <li>Suporte da comunidade para manter consistência nos estudos</li>
          <li>Compartilhamento de conquistas e aprendizados com o grupo</li>
        </ul>
        <p>
          Essa é baseado em uma lição que eu aprendi com a newsletter.{" "}
          <strong>Um pouco de pressão social</strong> pode ser bem vinda para
          nos manter no caminho.
        </p>
        <p>
          Se você já assinou, confira{" "}
          <a
            href="https://newsletter.nagringa.dev/p/como-definir-boas-metas-para-a-sua"
            className="underline"
            target="_blank"
          >
            esse artigo
          </a>{" "}
          para entender como definir boas metas.
        </p>
      </section>
    ),
  },
  {
    tabContent: (
      <>
        <BookOpen className="h-4 w-4 mr-2 text-violet-400 group-data-[state=active]:text-primary" />
        Conteúdo Exclusivo
      </>
    ),
    title: "Conteúdo Exclusivo",
    content: (
      <section className="prose dark:prose-invert">
        <h3>Conteúdo Exclusivo</h3>
        <p>
          Biblioteca completa de recursos para impulsionar sua carreira
          internacional:
        </p>
        <ul>
          <li>
            Artigos e conteúdos exclusivos para assinantes, como dicas de
            negociação
          </li>
          <li>
            Templates e documentos que podem ser usados para acelerar tua
            carreira (brag document, currículos, etc)
          </li>
          <li>Seleção de todos os livros e cursos que eu já usei</li>
        </ul>
        <p>
          Material desenvolvido com base em experiências reais e constantemente
          atualizado conforme eu aprendo novos métodos.
        </p>
      </section>
    ),
  },
];

export function MentorshipSection({ newsletterUrl }: MentorshipSectionProps) {
  return (
    <div id="mentorship">
      <div className="prose dark:prose-invert mb-8">
        <p>
          Com a demanda do conteúdo, vi uma oportunidade algo que eu sempre
          quis. Uma comunidade exclusiva para profissionais de TI que estão
          buscando crescimento profissional e pessoal.
        </p>
        <p>
          Um lugar onde podemos compartilhar experiências, dúvidas, e
          oportunidades.
        </p>
        <p>
          E é daqui que nasceu a mentoria do Dev na Gringa. Onde você pode ter
          acesso a:
        </p>
      </div>

      <Tabs defaultValue={mentorshipItems[0].title} className="mb-8 grid gap-4">
        <TabsList className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 bg-transparent">
          {mentorshipItems.map((item) => (
            <TabsTrigger
              key={item.title}
              value={item.title}
              className="group bg-white/5 text-neutral-400 hover:text-neutral-200 hover:bg-white/10
                data-[state=active]:border data-[state=active]:border-primary/50
                data-[state=active]:bg-primary/10 data-[state=active]:text-primary
                data-[state=active]:hover:bg-primary/20 data-[state=active]:hover:border-primary
                transition-colors"
              aria-label={item.title}
            >
              {item.tabContent}
            </TabsTrigger>
          ))}
        </TabsList>
        {mentorshipItems.map((item) => (
          <TabsContent key={item.title} value={item.title}>
            <div className="relative h-full w-full rounded-xl max-w-full overflow-hidden">
              <BorderBeam />
              <div className="bg-white/5 p-6 rounded-lg">{item.content}</div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Button className="w-full md:w-auto min-w-64" asChild>
        <Link href={`${newsletterUrl}/subscribe?ref=nagringa.dev`}>
          Faça parte da mentoria
          <Network className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
