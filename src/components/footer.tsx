import { SubscribeButton } from "@/components/newsletter-button";
import { SOCIAL_LINKS, SOCIALS } from "@/lib/constants";
import { getMostPopularArticles } from "@/use-cases/get-articles";
import Image from "next/image";
import Link from "next/link";
import FooterHeroImage from "../../public/footer.webp";

const tools = [
  {
    name: "Calculadora de Salário Líquido CLT vs PJ",
    href: "/calculadora-clt-vs-pj",
  },
  {
    name: "Gerador de Invoice",
    href: "/gerador-de-invoice",
  },
  { name: "Newsletter", href: SOCIALS.newsletter },
];

export function Footer() {
  const popularArticles = getMostPopularArticles().slice(0, 5);

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
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0118] via-[#0A0118]/80 to-[#0A0118]/60" />
        </div>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 container py-24">
        {/* CTA Section */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-primary text-lg font-semibold">
            Faça parte da mentoria
          </h2>
          <p className="mt-2 text-4xl font-semibold">
            Desenvolva sua carreira internacional em engenharia de software
          </p>
          <p className="mt-6 text-lg text-secondary-text">
            Você receberá um e-mail sobre como participar depois de se
            inscrever.
            <br />
            <a
              href="https://newsletter.nagringa.dev/about#§beneficios-para-assinantes-pagos"
              className="text-accent-secondary font-semibold hover:text-primary/90"
            >
              Confira todos os benefícios aqui.
            </a>
          </p>
          <div className="mt-8">
            <SubscribeButton>
              Participar da mentoria
              <div className="motion-preset-oscillate motion-duration-1500 bg-white/50 text-black rounded-full w-8 h-8 flex items-center justify-center">
                🛸
              </div>
            </SubscribeButton>
            <p className="text-xs text-secondary-text">
              Para os devs deste e de outros mundos também.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/10">
          {/* Popular Posts */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Artigos populares</h3>
            <div className="space-y-4">
              {popularArticles.map((post) => (
                <Link
                  href={`${SOCIALS.newsletter}/p/${post.slug}`}
                  key={post.slug}
                  className="block hover:text-primary"
                  target="_blank"
                >
                  {post.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Ferramentas</h3>
            <ul className="space-y-4">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    href={tool.href}
                    className="hover:text-primary"
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
            <h3 className="text-lg font-semibold mb-6">Contato</h3>
            <p className="mb-4">Tem alguma dúvida? Fale comigo aqui:</p>
            <a
              className="text-primary block mb-6"
              href="mailto:hi@lucasfaria.dev"
            >
              hi@lucasfaria.dev
            </a>
            <div className="flex gap-4">
              <a
                key={SOCIAL_LINKS.linkedin.href}
                href={SOCIAL_LINKS.linkedin.href}
                className=" hover:text-primary"
              >
                <span className="sr-only">{SOCIAL_LINKS.linkedin.title}</span>
                <SOCIAL_LINKS.linkedin.icon className="h-6 w-6" />
              </a>
              <a
                key={SOCIAL_LINKS.instagram.href}
                href={SOCIAL_LINKS.instagram.href}
                className=" hover:text-primary"
              >
                <span className="sr-only">{SOCIAL_LINKS.instagram.title}</span>
                <SOCIAL_LINKS.instagram.icon className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-white/10 flex justify-between text-xs md:flex-row flex-col gap-4">
          <Link href="/politica-de-privacidade">Política de privacidade</Link>
          <p className="">
            &copy; {new Date().getFullYear()}. Criado por{" "}
            <Link
              href={SOCIALS.personalWebsite}
              className="text-primary hover:text-primary/90"
              target="_blank"
            >
              Lucas Faria
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
