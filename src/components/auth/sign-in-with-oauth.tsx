"use client";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { SiGoogle } from "@icons-pack/react-simple-icons";

function SignInWithGoogle() {
  const { signIn } = useAuthActions();
  return (
    <Button
      className="flex-1"
      type="button"
      onClick={() => void signIn("google")}
    >
      <SiGoogle className="mr-2 h-4 w-4" /> Entrar com o Google
    </Button>
  );
}

export function SignInWithOAuth() {
  return (
    <div className="flex flex-col min-[460px]:flex-row w-full gap-2 items-stretch">
      <SignInWithGoogle />
    </div>
  );
}
