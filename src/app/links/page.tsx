import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MENTORSHIP_LINKS, SOCIAL_LINKS, TOOLS } from "@/lib/constants";
import { getArticles } from "@/use-cases/get-articles";
import { Lock } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ShareButton from "./share-button";

export const metadata: Metadata = {
  title: "Links | Dev na Gringa",
  description:
    "Links importantes do Dev na Gringa para facilitar sua navegação.",
};

export default function LinksPage() {
  const articles = getArticles();

  return (
    <div className="min-h-screen py-12 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 motion-preset-fade motion-preset-slide-up motion-duration-1000 relative">
          <ShareButton />
          <BorderBeam className="absolute inset-0 -z-10" />
          <div className="py-8">
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-teal-400 text-transparent bg-clip-text">
              Dev na Gringa
            </h1>
            <p className="text-slate-300 max-w-md mx-auto mt-4">
              Todos os links importantes para você acompanhar o conteúdo e
              recursos do Dev na Gringa.
            </p>
          </div>
        </div>

        {/* Social Links */}
        <section className="space-y-4 motion-preset-fade motion-duration-700 motion-delay-100">
          <h2 className="text-xl font-semibold text-white">Redes Sociais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.values(SOCIAL_LINKS).map((link, index) => (
              <Link
                href={link.href}
                key={link.title}
                target="_blank"
                rel="noopener noreferrer"
                className="motion-preset-scale motion-duration-500 motion-ease-spring-bouncy"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="bg-slate-900 border-slate-800 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="bg-slate-800 p-2 rounded-full">
                      <link.icon className="h-5 w-5 text-pink-500" />
                    </div>
                    <span className="font-medium text-white">{link.title}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="space-y-4 motion-preset-fade motion-duration-700 motion-delay-200">
          <h2 className="text-xl font-semibold text-white">Ferramentas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.values(TOOLS).map((tool, index) => (
              <Link
                href={tool.href}
                key={tool.title}
                className="motion-preset-scale motion-duration-500 motion-ease-spring-bouncy"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="bg-slate-900 border-slate-800 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="bg-slate-800 p-2 rounded-full">
                      <tool.icon className="h-5 w-5 text-teal-500" />
                    </div>
                    <span className="font-medium text-white">{tool.title}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Mentorship Links - For Paid Subscribers */}
        <section className="space-y-4 motion-preset-fade motion-duration-700 motion-delay-300">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold text-white">
              Recursos da Mentoria
            </h2>
            <Badge variant="outline" className="border-pink-500 text-pink-500">
              <Lock className="h-3 w-3 mr-1" />
              Assinantes
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {Object.values(MENTORSHIP_LINKS).map((link, index) => (
              <Link
                href={link.href}
                key={link.title}
                target="_blank"
                rel="noopener noreferrer"
                className="motion-preset-scale motion-duration-500 motion-ease-spring-bouncy"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="bg-slate-900 border-slate-800 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <div className="bg-slate-800 p-2 rounded-full">
                      <link.icon className="h-5 w-5 text-pink-500" />
                    </div>
                    <span className="font-medium text-white">{link.title}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="flex justify-center motion-preset-fade motion-duration-700 motion-delay-500">
            <Button
              asChild
              className="bg-gradient-to-r from-pink-500 to-teal-400 hover:from-pink-600 hover:to-teal-500 text-white"
            >
              <Link
                href={SOCIAL_LINKS.newsletter.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Assinar a Newsletter
              </Link>
            </Button>
          </div>
        </section>

        {/* Articles */}
        <section className="space-y-4 motion-preset-fade motion-duration-700 motion-delay-400">
          <h2 className="text-xl font-semibold text-white">Artigos</h2>
          <div className="grid grid-cols-1 gap-4">
            {articles.slice(0, 10).map((article, index) => (
              <Link
                href={article.canonical_url}
                key={article.id}
                target="_blank"
                rel="noopener noreferrer"
                className="motion-preset-scale motion-duration-500 motion-ease-spring-bouncy"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="bg-slate-900 border-slate-800 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 transition-all duration-300 overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-40 md:h-auto md:w-1/3">
                      <Image
                        src={article.coverImage || ""}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4 md:w-2/3">
                      <div className="space-y-2">
                        <h3 className="font-medium text-white line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-2">
                          {article.description}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <span>
                            {new Date(article.postDate).toLocaleDateString(
                              "pt-BR"
                            )}
                          </span>
                          <span>•</span>
                          <span>{article.views} visualizações</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <div className="flex justify-center motion-preset-fade motion-duration-700 motion-delay-500">
            <Button
              asChild
              variant="outline"
              className="border-teal-500 text-teal-500 hover:bg-teal-500/10"
            >
              <Link
                href={SOCIAL_LINKS.newsletter.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver Todos os Artigos
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
