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
    <div className="flex flex-col gap-4">
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
              <span className="text-xs text-muted-foreground font-medium text-center">
                Você entrou por aqui na última vez.
              </span>
            )}
          </div>

          <div className="relative flex items-center gap-3">
            <div className="h-[1px] flex-1 bg-slate-600" />
            <span className="text-xs text-muted-foreground">
              ou, com outro email:
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
        <EmailAppLinks email={email} />
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
    setSubmitting(true);
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
      <div className="flex flex-col gap-1">
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
        />
        {wasLastUsed && (
          <span className="text-xs text-muted-foreground font-medium text-center">
            Você entrou por aqui na última vez.
          </span>
        )}
      </div>
      <Button type="submit" variant="ghost" loading={submitting}>
        Enviar link por email
      </Button>
    </form>
  );
}

function EmailAppLinks({ email }: { email: string }) {
  const getEmailConfig = (email: string) => {
    const domain = email.split("@")[1].toLowerCase();

    const configs = {
      "gmail.com": {
        name: "Gmail",
        app: {
          ios: "googlegmail://",
          android: "https://mail.google.com/mail/",
        },
        web: "https://mail.google.com/mail/",
      },
      "outlook.com": {
        name: "Outlook",
        app: {
          ios: "ms-outlook://",
          android: "https://outlook.office365.com/mail/",
        },
        web: "https://outlook.live.com/mail/",
      },
      "hotmail.com": {
        name: "Outlook",
        app: {
          ios: "ms-outlook://",
          android: "https://outlook.office365.com/mail/",
        },
        web: "https://outlook.live.com/mail/",
      },
      "icloud.com": {
        name: "iCloud Mail",
        app: {
          ios: "message://",
          android: "https://www.icloud.com/mail",
        },
        web: "https://www.icloud.com/mail",
      },
      "yahoo.com": {
        name: "Yahoo Mail",
        app: {
          ios: "ymail://",
          android: "ymail://",
        },
        web: "https://mail.yahoo.com",
      },
    };

    const domainConfig = Object.entries(configs).find(([key]) =>
      domain.endsWith(key)
    )?.[1];

    return domainConfig;
  };

  const handleEmailAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const config = getEmailConfig(email);
    if (!config) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    // Deep link URL based on platform
    const appUrl = isIOS
      ? config.app.ios
      : isAndroid
        ? config.app.android
        : config.web;

    if (isIOS || isAndroid) {
      const appTimeout = setTimeout(() => {
        window.location.href = config.web;
      }, 1000);

      window.location.href = appUrl;

      window.addEventListener("blur", () => {
        clearTimeout(appTimeout);
      });
    } else {
      window.location.href = config.web;
    }
  };

  const emailConfig = getEmailConfig(email);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Link enviado para {email}.</span>

      {emailConfig && (
        <Button variant="link" className="h-auto p-0" asChild>
          <a href={emailConfig.web} onClick={handleEmailAppClick}>
            Abrir {emailConfig.name} →
          </a>
        </Button>
      )}
    </div>
  );
}
