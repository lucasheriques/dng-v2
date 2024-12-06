import { Providers } from "@/app/providers";
import { BottomSearchFab } from "@/components/bottom-search-fab";
import { Footer } from "@/components/footer";
import Header from "@/components/header";
import PostHogPageView from "@/components/posthog-page-view";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/toaster";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export const metadata = {
  title: "Dev na Gringa | Do Brasil para o mundo inteiro.",
  description: `O Dev na Gringa é uma comunidade para todos interessados em engenharia de software e áreas adjacentes. Nosso foco é em crescimento profissional e carreira internacional.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="pt-BR" className="nice-scrollbar">
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
