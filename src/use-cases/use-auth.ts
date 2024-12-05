import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useAuth() {
  const user = useQuery(api.users.viewer);
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut, signIn } = useAuthActions();

  return { ...user, isAuthenticated, isLoading, signOut, signIn };
}
