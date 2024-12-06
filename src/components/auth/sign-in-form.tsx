"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/use-cases/use-auth";
import { SiGoogle } from "@icons-pack/react-simple-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

export function SignIn() {
  const { signIn, isAuthenticated } = useAuth();
  const router = useRouter();
  const [lastUsedMethod, setLastUsedMethod] = useLocalStorage<
    "google" | "email" | ""
  >("lastUsedMethod", "");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"signIn" | "linkSent">("signIn");

  const handleLinkSent = () => {
    setLastUsedMethod("email");
    setStep("linkSent");
  };

  const handleGoogleSignIn = () => {
    signIn("google")
      .then(() => {
        setLastUsedMethod("google");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (isAuthenticated) {
    router.push("/perfil");
  }

  return (
    <div className="flex flex-col gap-6">
      {step === "signIn" && (
        <>
          <div className="flex flex-col gap-1 text-center">
            <Button
              variant="outline"
              type="button"
              size="xl"
              onClick={handleGoogleSignIn}
            >
              <SiGoogle className="mr-2 h-4 w-4" /> Entrar com o Google
            </Button>
            {lastUsedMethod === "google" && (
              <span className="text-xs text-muted-foreground font-medium">
                Você entrou por aqui na última vez.
              </span>
            )}
          </div>

          <div className="relative flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-slate-600" />
            <span className="text-xs text-muted-foreground">
              ou, entre com seu email:
            </span>
            <div className="h-[1px] flex-1 bg-slate-600" />
          </div>
        </>
      )}

      {step === "signIn" ? (
        <SignInWithMagicLink
          handleLinkSent={handleLinkSent}
          setEmail={setEmail}
          wasLastUsed={lastUsedMethod === "email"}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">
            Link enviado para {email}.
          </span>
          {email.endsWith("@gmail.com") && (
            <Button variant="link" className="h-auto p-0" asChild>
              <a
                href={`googlegmail:///co?to=${email}`}
                onClick={(e) => {
                  e.preventDefault();
                  // Try mobile app first
                  window.location.href = `googlegmail:///co?to=${email}`;
                  // Fallback to web after a small delay
                  setTimeout(() => {
                    window.open("https://gmail.com", "_blank");
                  }, 500);
                }}
              >
                Abrir Gmail →
              </a>
            </Button>
          )}
          {(email.endsWith("@outlook.com") ||
            email.endsWith("@hotmail.com") ||
            email.endsWith("@live.com")) && (
            <Button variant="link" className="h-auto p-0" asChild>
              <a
                href={`ms-outlook://emails`}
                onClick={(e) => {
                  e.preventDefault();
                  // Try mobile app first
                  window.location.href = "ms-outlook://emails";
                  // Fallback to web after a small delay
                  setTimeout(() => {
                    window.open("https://outlook.live.com", "_blank");
                  }, 500);
                }}
              >
                Abrir Outlook →
              </a>
            </Button>
          )}
          {email.endsWith("@icloud.com") && (
            <Button variant="link" className="h-auto p-0" asChild>
              <a
                href={`message://`}
                onClick={(e) => {
                  e.preventDefault();
                  // Try mobile app first
                  window.location.href = "message://";
                  // Fallback to web after a small delay
                  setTimeout(() => {
                    window.open("https://www.icloud.com/mail", "_blank");
                  }, 500);
                }}
              >
                Abrir iCloud Mail →
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function SignInWithMagicLink({
  handleLinkSent,
  setEmail,
  wasLastUsed,
}: {
  handleLinkSent: () => void;
  setEmail: (email: string) => void;
  wasLastUsed: boolean;
}) {
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleMagicLink = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    if (typeof email !== "string") return;
    signIn("resend", { email })
      .then(() => {
        setEmail(email);
        handleLinkSent();
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "Erro ao enviar o link de login",
          variant: "destructive",
        });
        setSubmitting(false);
      });
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleMagicLink}>
      <Label htmlFor="email">Email</Label>
      <Input
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
      />
      {wasLastUsed && (
        <span className="text-xs text-muted-foreground font-medium">
          Você entrou por aqui na última vez.
        </span>
      )}
      <Button type="submit" variant="ghost" disabled={submitting}>
        Enviar link por email
      </Button>
    </form>
  );
}
