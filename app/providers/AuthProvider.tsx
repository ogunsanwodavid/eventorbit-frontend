"use client";

import { ReactNode } from "react";

import { usePathname } from "next/navigation";

import useAuth from "../hooks/auth/useAuth";

import LoadingPage from "../components/ui/global/LoadingPage";

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

  //Check current page is auth or protected
  const isAuthPage = AUTH_PAGES.includes(pathname);

  //Auth info
  const { isLoading } = useAuth();
  //const isLoading = false;

  //Show loading page if not visiting protected page
  if (isLoading && !isAuthPage) {
    return <LoadingPage />;
  }

  return <>{children}</>;
}
