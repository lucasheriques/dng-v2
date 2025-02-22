"use client";

import { Button } from "@/components/ui/button";
import { SOCIALS } from "@/lib/constants";
import { useAuth } from "@/use-cases/use-auth";
import Link from "next/link";

interface Props {
  size?: "xl" | "lg";
  children: React.ReactNode;
}

export function SubscribeButton({ children, size = "xl" }: Props) {
  const { subscription } = useAuth();

  if (subscription?.paidSubscription) {
    return (
      <Button size={size} disabled>
        Você já assina! Muito obrigado 🙏
      </Button>
    );
  }

  return (
    <>
      <Button size={size} asChild disabled={!!subscription?.paidSubscription}>
        <Link
          href={`${SOCIALS.newsletter}/subscribe?ref=nagringa.dev`}
          target="_blank"
        >
          {children}
        </Link>
      </Button>
    </>
  );
}
