import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { MANAGE_SUBSCRIPTION_LINK } from "@/lib/constants";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "@convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import AssinantesClientPage from "./client-page";
import {
  EventsSection,
  EventsSectionSkeleton,
} from "./components/events-section";
export default async function AssinantesPage() {
  // Here you can add server-side code to preload auth status
  // For example, you could fetch user data or subscription status from the server
  const preloadedAuth = await preloadQuery(
    api.users.viewer,
    {},
    {
      token: await convexAuthNextjsToken(),
    }
  );

  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Área do Assinante</h1>
        <Button asChild size="lg" variant="link" className="px-0">
          <Link href={MANAGE_SUBSCRIPTION_LINK} target="_blank">
            Gerenciar assinatura
          </Link>
        </Button>
      </div>

      <AssinantesClientPage
        preloadedAuth={preloadedAuth}
        eventsSection={
          <Suspense fallback={<EventsSectionSkeleton />}>
            <EventsSection />
          </Suspense>
        }
      />
    </PageWrapper>
  );
}
