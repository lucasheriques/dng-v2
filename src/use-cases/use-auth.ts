import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";

export function useAuth() {
  const user = useQuery(api.users.viewer);
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut, signIn } = useAuthActions();

  return { ...user, isAuthenticated, isLoading, signOut, signIn };
}
