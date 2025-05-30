"use client";

import { CreditCard, LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MANAGE_SUBSCRIPTION_LINK } from "@/lib/constants";
import { useAuth } from "@/use-cases/use-auth";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";

export function UserDropdown() {
  const { user, isAuthenticated, signOut, isLoading, subscription } = useAuth();
  const posthog = usePostHog();

  if (isLoading) return null;

  if (isAuthenticated && (user?.email || user?._id)) {
    posthog.identify(user?.email ?? user?._id, {
      email: user?.email,
      name: user?.name,
      isPaidSubscriber: subscription?.paidSubscription,
    });
  }

  return (
    <>
      {!isAuthenticated ? (
        <Button variant="ghost" asChild>
          <Link href="/login">Login</Link>
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image} alt={user?.name ?? ""} />
                <AvatarFallback>
                  {user?.name?.toUpperCase() ?? user?.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 bg-slate-900"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/perfil" className="focus:outline-hidden">
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações (em breve)</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={MANAGE_SUBSCRIPTION_LINK}
                  target="_blank"
                  className="focus:outline-hidden"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Gerenciar assinatura</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
