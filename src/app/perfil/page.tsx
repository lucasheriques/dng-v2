"use client";
import { PageWrapper } from "@/components/page-wrapper";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/use-cases/use-auth";

export default function ProfilePage() {
  const { user, subscription, signOut } = useAuth();

  return (
    <PageWrapper>
      <div className="flex flex-col gap-4">
        <h1 className="font-semibold text-2xl tracking-tight">Seu perfil</h1>
        <ul className="space-y-2">
          <li>Nome: {user?.name}</li>
          <li>Email: {user?.email}</li>
          <li>Assina a newsletter: {subscription ? "Sim" : "Não"}</li>
          {subscription && (
            <li>
              Assinatura paga: {subscription?.paidSubscription ? "Sim" : "Não"}
            </li>
          )}
        </ul>
        <Button onClick={signOut} className="w-fit">
          Sair
        </Button>
      </div>
    </PageWrapper>
  );
}
