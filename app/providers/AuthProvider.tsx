"use client";

import { ReactNode } from "react";

import { usePathname } from "next/navigation";

import useAuth from "../hooks/auth/useAuth";

import OnboardingPage from "../components/ui/global/OnboardingPage";

//Path of auth pages
const AUTH_PAGES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/set-password",
  "/verify-email",
];

export default function AuthProvider({ children }: { children: ReactNode }) {
  //Pathname function
  const pathname = usePathname();

  //Auth info
  const { loading } = useAuth();

  //Auth page
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (loading) {
    return <OnboardingPage />;
  }

  return <>{children}</>;
}
