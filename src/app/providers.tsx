"use client";

import { BottomSearchFab } from "@/components/bottom-search-fab";
import PostHogPageView from "@/components/posthog-page-view";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/env";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { ConvexReactClient } from "convex/react";
import { LazyMotion } from "motion/react";
import dynamic from "next/dynamic";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useEffect } from "react";
import { Provider as BalancerProvider } from "react-wrap-balancer";

const loadFeatures = import("../components/framer-features").then(
  (res) => res.default
);

const PostHogProvider = dynamic(
  () => import("posthog-js/react").then((mod) => mod.PostHogProvider),
  {
    ssr: false,
  }
);

const asyncPosthog = await import("posthog-js");

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export function Providers({ children }: { children: React.ReactNode }) {
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    asyncPosthog.posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      disable_session_recording: isDev,
      ui_host: env.NEXT_PUBLIC_POSTHOG_UI_HOST,
      debug: isDev,
    });
  }, [isDev]);

  return (
    <LazyMotion features={async () => await loadFeatures} strict>
      <PostHogProvider client={asyncPosthog.posthog}>
        <ConvexAuthNextjsProvider client={convex}>
          <ConvexQueryCacheProvider>
            <NuqsAdapter>
              <BalancerProvider>{children}</BalancerProvider>
            </NuqsAdapter>
          </ConvexQueryCacheProvider>
        </ConvexAuthNextjsProvider>
      </PostHogProvider>
      <Toaster />
      <BottomSearchFab />
      <PostHogPageView />
    </LazyMotion>
  );
}
