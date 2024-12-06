"use client";

import { env } from "@/env";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { Provider as BalancerProvider } from "react-wrap-balancer";

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL);
if (typeof window !== "undefined") {
  // if NODE_ENV is development, don't initialize analytics and session replay

  const isDev = process.env.NODE_ENV === "development";

  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    disable_session_recording: isDev,
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
  });
}
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PostHogProvider client={posthog}>
      <ConvexAuthNextjsProvider client={convex}>
        <NuqsAdapter>
          <BalancerProvider>{children}</BalancerProvider>
        </NuqsAdapter>
      </ConvexAuthNextjsProvider>
    </PostHogProvider>
  );
}
