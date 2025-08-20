"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { Profile } from "@/app/models/auth";

import { getAuthStatus } from "@/app/actions/auth/get-status";

import { getProfile } from "@/app/actions/auth/get-profile";

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  profile: Profile | null;
}

interface AuthContextValue extends AuthState {
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  //Authentication status
  const [auth, setAuth] = useState<AuthState>({
    loading: false,
    isAuthenticated: false,
    profile: null,
  });

  //Refresh auth function
  const refreshAuth = async () => {
    setAuth((prev) => ({ ...prev, loading: true }));

    try {
      const authenticated = await getAuthStatus();
      let profile: Profile | null = null;

      if (authenticated) {
        profile = (await getProfile()) ?? null;
      }

      setAuth({ loading: false, isAuthenticated: authenticated, profile });
    } catch {
      setAuth({ loading: false, isAuthenticated: false, profile: null });
    }
  };

  return (
    <AuthContext.Provider value={{ ...auth, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
