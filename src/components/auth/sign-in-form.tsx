"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/use-cases/use-auth";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { useRouter } from "next/navigation";

export function SignIn() {
  const { signIn, isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    router.push("/perfil");
  }

  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      size="xl"
      onClick={() => void signIn("google")}
    >
      <SiGoogle className="mr-2 h-4 w-4" /> Entrar com o Google
    </Button>
  );
}
