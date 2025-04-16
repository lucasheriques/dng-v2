"use client";

import { AnimatedStat } from "@/app/components/animated-stat";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react/cache/hooks";

export default function Stats() {
  const query = useQuery(api.subscribers.getSubscriberStats);

  return (
    <div className="mt-16 flex justify-center items-center border-t border-white/10 pt-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl w-full">
        <AnimatedStat
          value={query?.totalSubscribers}
          label="inscritos na newsletter"
          color="text-primary"
        />
        <AnimatedStat
          value={query?.totalSubscribers ? 270 : 0}
          label="membros na comunidade"
          color="text-yellow-400"
        />
        <AnimatedStat
          value={query?.paidSubscribers}
          label="assinantes da mentoria"
          color="text-accent-secondary"
        />
      </div>
    </div>
  );
}
