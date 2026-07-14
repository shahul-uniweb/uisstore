import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { watchAdminAuth, type AdminProfile } from "@/lib/admin";

type AdminAuthState = {
  profile: AdminProfile | null;
  loading: boolean;
};

const AdminAuthContext = createContext<AdminAuthState>({ profile: null, loading: true });

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

// Subscribes to Firebase Auth once for the whole /admin subtree, so every page
// under it shares one listener instead of each mounting its own.
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({ profile: null, loading: true });

  useEffect(() => {
    const unsubscribe = watchAdminAuth((profile) => setState({ profile, loading: false }));
    return unsubscribe;
  }, []);

  return <AdminAuthContext.Provider value={state}>{children}</AdminAuthContext.Provider>;
}
