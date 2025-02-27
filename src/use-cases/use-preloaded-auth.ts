import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { Preloaded, useConvexAuth, usePreloadedQuery } from "convex/react";

export function usePreloadedAuth(
  preloadedQuery: Preloaded<typeof api.users.viewer>
) {
  const user = usePreloadedQuery(preloadedQuery);
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut, signIn } = useAuthActions();

  return { ...user, isAuthenticated, isLoading, signOut, signIn };
}
