"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

import { useAuth } from "../contexts/AuthContext";

import OnboardingPage from "../components/ui/global/OnboardingPage";

//Path to auth pages
const AUTH_PAGES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/set-password",
  "/verify-email",
];

export default function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //Pathname function
  const pathname = usePathname();

  //Auth context variables
  const { refreshAuth, loading } = useAuth();

  //Refresh auth once on mount
  useEffect(() => {
    refreshAuth();
  }, []);

  //Check if auth page
  const isAuthPage = AUTH_PAGES.some((p) => pathname.startsWith(p));

  //Show onboarding page only if not accessing auth pages
  if (!isAuthPage && loading) {
    return <OnboardingPage />;
  }

  return <>{children}</>;
}
