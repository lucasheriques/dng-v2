"use client";
import { SignInWithOAuth } from "@/components/auth/sign-in-with-oauth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export function SignInFormEmailLink() {
  const [step, setStep] = useState<"signIn" | "linkSent">("signIn");

  return (
    <div className="min-w-[384px] flex flex-col gap-4">
      {step === "signIn" ? (
        <>
          <h2 className="font-semibold text-2xl tracking-tight">
            Entrar ou criar conta
          </h2>
          <SignInWithMagicLink handleLinkSent={() => setStep("linkSent")} />
          <SignInWithOAuth />
        </>
      ) : (
        <>
          <h2 className="font-semibold text-2xl tracking-tight">
            Check your email
          </h2>
          <p>A sign-in link has been sent to your email address.</p>
          <Button
            className="p-0 self-start"
            variant="link"
            onClick={() => setStep("signIn")}
          >
            Cancel
          </Button>
        </>
      )}
      <Toaster />
    </div>
  );
}

function SignInWithMagicLink({
  handleLinkSent,
}: {
  handleLinkSent: () => void;
}) {
  const { signIn } = useAuthActions();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        signIn("resend", formData)
          .then(handleLinkSent)
          .catch((error) => {
            console.error(error);
            toast({
              title: "Could not send sign-in link",
              variant: "destructive",
            });
            setSubmitting(false);
          });
      }}
    >
      <Label htmlFor="email">Email</Label>
      <Input
        name="email"
        id="email"
        className="mb-4 mt-2"
        autoComplete="email"
      />
      <Button type="submit" disabled={submitting}>
        Enviar link por e-mail
      </Button>
    </form>
  );
}
