import { Providers } from "@/app/providers";
import { Footer } from "@/components/footer";
import GeneralHeaderBanner from "@/components/general-header-banner";
import Header from "@/components/header";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { cn } from "@/lib/utils";
import { getRandomArticles } from "@/use-cases/get-articles";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Dev na Gringa | Comunidade Tech para Carreira Internacional",
  description:
    "Comunidade e mentoria para devs brasileiros que querem trabalhar no exterior. Aprenda com quem já está lá, networking ativo e conteúdo exclusivo sobre carreira tech internacional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const randomArticles = getRandomArticles(2);
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="pt-BR" className="nice-scrollbar dark">
        <head>
          {/* <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          /> */}
        </head>
        <body
          className={cn(
            "font-sans antialiased selection:bg-teal-500 selection:text-slate-950 bg-background dark:text-main-text",
            inter.variable
          )}
        >
          <Providers>
            {/* <LastArticleBanner /> */}
            <GeneralHeaderBanner />
            <Header articles={randomArticles} />
            <main className="min-h-dvh">{children}</main>
            <Footer />
          </Providers>
          <TailwindIndicator />
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
