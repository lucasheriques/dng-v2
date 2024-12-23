import { Providers } from "@/app/providers";
import { BottomSearchFab } from "@/components/bottom-search-fab";
import { Footer } from "@/components/footer";
import Header from "@/components/header";
import LastArticleBanner from "@/components/last-article-banner";
import PostHogPageView from "@/components/posthog-page-view";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

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
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="pt-BR" className="nice-scrollbar">
        <head>
          {/* <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          /> */}
        </head>
        <body
          className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased dark selection:bg-teal-500 selection:text-slate-950 bg-slate-950`}
        >
          <NextTopLoader
            color="#FF4D8E"
            height={3}
            crawl={true}
            crawlSpeed={200}
            initialPosition={0.08}
            easing="ease"
            speed={200}
            zIndex={1000}
            showAtBottom={false}
          />
          <Providers>
            <LastArticleBanner />
            <Header />
            <main className="min-h-dvh bg-slate-950">{children}</main>
            <Footer />
            <BottomSearchFab />
            <Toaster />
            <PostHogPageView />
          </Providers>
          <TailwindIndicator />
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
