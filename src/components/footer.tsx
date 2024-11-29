import { Button } from "@/components/ui/button";
import { MOST_POPULAR_ARTICLES, SOCIAL_LINKS, SOCIALS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import FooterHeroImage from "../../public/footer.webp";

const tools = [
  {
    name: "Calculadora de Salário Líquido CLT vs PJ",
    href: "/calculadora-clt-vs-pj",
  },
  { name: "Newsletter", href: SOCIALS.newsletter },
];

export function Footer() {
  return (
    <footer className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src={FooterHeroImage}
            placeholder="blur"
            alt="Mapa mundi digital com efeito cósmico"
            fill
            className="object-cover opacity-90 pointer-events-none select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0118] via-[#0A0118]/80 to-[#0A0118]/60" />
        </div>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* CTA Section */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-[#5CFFE1] text-lg font-semibold">
            Faça parte da mentoria
          </h2>
          <p className="mt-2 text-4xl font-semibold text-white">
            Desenvolva sua carreira internacional em engenharia de software
          </p>
          <p className="mt-6 text-lg text-gray-300">
            Você receberá um e-mail sobre como participar depois de se
            inscrever.
            <br />
            <a
              href="https://newsletter.nagringa.dev/about#§beneficios-para-assinantes-pagos"
              className="text-accent-secondary font-semibold hover:text-[#5CFFE1]/90 transition-colors"
            >
              Confira todos os benefícios aqui.
            </a>
          </p>
          <div className="mt-8">
            <Button
              size="xl"
              asChild
              className="group group-hover:motion-preset-slide-right-lg motion-duration-1000"
            >
              <Link
                href={`${SOCIALS.newsletter}/subscribe?ref=nagringa.dev`}
                target="_blank"
              >
                Participar da mentoria
                <div className="motion-preset-oscillate motion-duration-1500 bg-white/50 text-black rounded-full w-8 h-8 flex items-center justify-center">
                  🛸
                </div>
              </Link>
            </Button>
            <p className="text-xs text-gray-300">
              Para os devs deste e de outros mundos também.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/10">
          {/* Popular Posts */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Artigos populares
            </h3>
            <div className="space-y-4">
              {MOST_POPULAR_ARTICLES.slice(0, 5).map((post, index) => (
                <div key={index}>
                  <Link
                    href="#"
                    className="block text-gray-300 hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">
              Ferramentas
            </h3>
            <ul className="space-y-4">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className="text-gray-300 hover:text-[#5CFFE1] transition-colors"
                    prefetch={true}
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contato</h3>
            <p className="text-gray-300 mb-4">
              Tem alguma dúvida? Fale comigo aqui:
            </p>
            <a
              className="text-[#5CFFE1] block mb-6"
              href="mailto:hi@lucasfaria.dev"
            >
              hi@lucasfaria.dev
            </a>
            <div className="flex gap-4">
              <a
                key={SOCIAL_LINKS.linkedin.href}
                href={SOCIAL_LINKS.linkedin.href}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <span className="sr-only">{SOCIAL_LINKS.linkedin.title}</span>
                <SOCIAL_LINKS.linkedin.icon className="h-6 w-6" />
              </a>
              <a
                key={SOCIAL_LINKS.x.href}
                href={SOCIAL_LINKS.x.href}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <span className="sr-only">{SOCIAL_LINKS.x.title}</span>
                <SOCIAL_LINKS.x.icon className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <p className="text-center text-gray-400">
            &copy; {new Date().getFullYear()} Criado por{" "}
            <Link
              href={SOCIALS.personalWebsite}
              className="text-[#5CFFE1] hover:text-[#5CFFE1]/90 transition-colors"
              target="_blank"
            >
              Lucas Faria
            </Link>
            . Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
