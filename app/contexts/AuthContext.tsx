"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { Profile } from "@/app/models/auth";

import { getAuthStatus } from "@/app/api/auth/get-status";

import { getProfile } from "@/app/api/auth/get-profile";

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  profile: Profile | null;
}

type RefreshAuthOptions = {
  setLoading?: boolean;
};

interface AuthContextValue extends AuthState {
  refreshAuth: (options?: RefreshAuthOptions) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  //Authentication status
  const [auth, setAuth] = useState<AuthState>({
    loading: false,
    isAuthenticated: true,
    profile: null,
  });

  //Refresh auth function
  //::With OPTIONS
  const refreshAuth = async (options?: RefreshAuthOptions) => {
    //Make set loading true optional
    //::Default to true
    const { setLoading = true } = options ?? {};

    if (setLoading) {
      setAuth((prev) => ({ ...prev, loading: true }));
    }

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
