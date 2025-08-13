"use client";

import { ReactNode } from "react";

import useAuth from "../hooks/auth/useAuth";

export default function AuthProvider({ children }: { children: ReactNode }) {
  //Auth info
  const { isLoading, isError } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-lg">Loading authentication...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Failed to load authentication state.
      </div>
    );
  }

  return <>{children}</>;
}
