"use client";

import { ReactNode } from "react";

import useAuth from "../hooks/auth/useAuth";

import LoadingPage from "../components/ui/global/LoadingPage";

export default function AuthProvider({ children }: { children: ReactNode }) {
  //Auth info
  //const { isLoading } = useAuth();
  const isLoading = false;

  //Show loading page if not visiting protected page
  if (isLoading) {
    return <LoadingPage />;
  }

  return <>{children}</>;
}
