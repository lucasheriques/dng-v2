"use client";

import { BottomSearchFab } from "@/components/bottom-search-fab";
import PostHogPageView from "@/components/posthog-page-view";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/env";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache/provider";
import { ConvexReactClient } from "convex/react";
import { LazyMotion } from "motion/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import posthog, { PostHogConfig } from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { Provider as BalancerProvider } from "react-wrap-balancer";

const loadFeatures = import("../components/framer-features").then(
  (res) => res.default
);

// Convex won't work without a valid URL, so we need to provide a default one
// In practice it means Convex will not load without setting it up but that's ok
const convex = new ConvexReactClient(
  env.NEXT_PUBLIC_CONVEX_URL ?? "https://yours.convex.url"
);

export function Providers({ children }: { children: React.ReactNode }) {
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (!env.NEXT_PUBLIC_POSTHOG_KEY || !env.NEXT_PUBLIC_POSTHOG_HOST) {
      return;
    }

    const config: Partial<PostHogConfig> = {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      disable_session_recording: isDev,
      capture_exceptions: true,
      debug: isDev,
    };

    if (env.NEXT_PUBLIC_POSTHOG_UI_HOST) {
      config.ui_host = env.NEXT_PUBLIC_POSTHOG_UI_HOST;
    }

    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, config);
  }, [isDev]);

  return (
    <LazyMotion features={async () => await loadFeatures} strict>
      <PostHogProvider client={posthog}>
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
