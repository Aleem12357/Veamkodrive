import { useAuth } from "@/contexts/AuthContext";

/**
 * Thin wrapper — admin state is now cached in AuthContext.
 * Components that used useIsAdmin() directly continue to work unchanged.
 */
export const useIsAdmin = () => {
  const { isAdmin, adminChecking } = useAuth();
  return { isAdmin, checking: adminChecking };
};
