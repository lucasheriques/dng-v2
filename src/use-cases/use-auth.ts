import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex-helpers/react/cache";
import { useConvexAuth } from "convex/react";

export function useAuth() {
  const user = useQuery(api.users.viewer);
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut, signIn } = useAuthActions();

  return { ...user, isAuthenticated, isLoading, signOut, signIn };
}
