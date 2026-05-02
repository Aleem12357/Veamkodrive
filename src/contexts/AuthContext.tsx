import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  adminChecking: boolean;
  sessionExpiresAt: number | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminChecking, setAdminChecking] = useState(true);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<number | null>(null);

  const checkAdmin = useCallback(async (uid: string | null, email?: string) => {
    if (!uid) { 
      setIsAdmin(false); 
      setIsSuperAdmin(false); 
      setAdminChecking(false); 
      return; 
    }
    
    setAdminChecking(true);
    
    // 1. Check Database roles
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid);
    
    const roles = data?.map(r => r.role) || [];
    const hasSuper = roles.includes("super_admin");
    const hasAdmin = roles.includes("admin") || hasSuper;
    
    setIsAdmin(hasAdmin);
    setIsSuperAdmin(hasSuper);
    setAdminChecking(false);
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setIsSuperAdmin(false);
    setSessionExpiresAt(null);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setSessionExpiresAt(newSession?.expires_at ?? null);
      setTimeout(() => checkAdmin(newSession?.user?.id ?? null, newSession?.user?.email), 0);
    });

    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      setUser(existing?.user ?? null);
      setSessionExpiresAt(existing?.expires_at ?? null);
      setLoading(false);
      checkAdmin(existing?.user?.id ?? null, existing?.user?.email);
    });

    return () => subscription.unsubscribe();
  }, [checkAdmin]);

  useEffect(() => {
    if (!sessionExpiresAt) return;

    const checkExpiry = () => {
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = sessionExpiresAt - now;

      if (timeLeft <= 0) {
        signOut();
        toast.error("Session expired. Please sign in again.");
      } else if (timeLeft <= 300 && timeLeft > 240) {
        toast.warning("Your session will expire in 5 minutes.", {
          description: "Please refresh the page to stay logged in.",
          duration: 10000,
        });
      }
    };

    const timer = setInterval(checkExpiry, 60000);
    return () => clearInterval(timer);
  }, [sessionExpiresAt]);

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, isSuperAdmin, adminChecking, sessionExpiresAt, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

