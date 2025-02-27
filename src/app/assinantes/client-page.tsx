"use client";
import { usePreloadedAuth } from "@/use-cases/use-preloaded-auth";
import { api } from "@convex/_generated/api";
import { Preloaded } from "convex/react";
import { LinksSection } from "./components/links-section";
import { NonSubscriberView } from "./components/non-subscriber-view";

type Props = {
  preloadedAuth: Preloaded<typeof api.users.viewer>;
  eventsSection: React.ReactNode;
};

export default function AssinantesClientPage({
  preloadedAuth,
  eventsSection,
}: Props) {
  const { subscription } = usePreloadedAuth(preloadedAuth);

  // Non-subscriber view with blurred background and message overlay
  if (!subscription?.paidSubscription) {
    return <NonSubscriberView />;
  }

  // Subscriber view - no need for blur class anymore
  return (
    <>
      {eventsSection}
      <LinksSection />
    </>
  );
}
