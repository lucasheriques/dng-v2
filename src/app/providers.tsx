"use client";

import { env } from "@/env";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { LazyMotion } from "motion/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { Provider as BalancerProvider } from "react-wrap-balancer";

const loadFeatures = import("../components/framer-features").then(
  (res) => res.default
);

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);

export function Providers({ children }: { children: React.ReactNode }) {
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: "identified_only",
      capture_pageview: false, // Disable automatic pageview capture, as we capture manually
      disable_session_recording: isDev,
      ui_host: env.NEXT_PUBLIC_POSTHOG_UI_HOST,
    });
  }, [isDev]);

  return (
    <LazyMotion features={async () => await loadFeatures} strict>
      <PostHogProvider client={posthog}>
        <ConvexAuthNextjsProvider client={convex}>
          <NuqsAdapter>
            <BalancerProvider>{children}</BalancerProvider>
          </NuqsAdapter>
        </ConvexAuthNextjsProvider>
      </PostHogProvider>
      o
    </LazyMotion>
  );
}
