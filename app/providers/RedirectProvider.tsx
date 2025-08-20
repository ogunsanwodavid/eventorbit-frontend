"use client";

import { useEffect, useRef } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuth } from "../contexts/AuthContext";

import { toast } from "sonner";

//Path of auth pages
const AUTH_PAGES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/set-password",
  "/verify-email",
];

//Path to protected routes
const PROTECTED_PATHS = ["/create"];

export default function RedirectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //Auth status
  const { isAuthenticated } = useAuth();

  //Pathname function
  const pathname = usePathname();

  //Search params function
  const searchParams = useSearchParams();

  //Router function
  const router = useRouter();

  //States of previous path and redirect before current active page
  const prevPathRef = useRef<string | null>(null);
  const prevRedirectRef = useRef<string | null>(null);

  useEffect(() => {
    //Check current page is auth or protected
    const isAuthPage = AUTH_PAGES.includes(pathname);
    const isProtected = PROTECTED_PATHS.some((path) =>
      pathname.startsWith(path)
    );

    //Previous path and redirect
    const prevPath = prevPathRef.current;
    const prevRedirect = prevRedirectRef.current;
    const hasRedirectParam = searchParams?.has("redirect");

    //PROTECTED PAGES
    //::If authenticated, redirect to sign-in page with proper redirect
    if (isProtected && !isAuthenticated) {
      const redirectPath = encodeURIComponent(
        pathname + (searchParams?.toString() ? `?${searchParams}` : "")
      );
      router.replace(`/sign-in?redirect=${redirectPath}`);
      return;
    }

    //AUTH PAGES
    if (isAuthPage) {
      //::Already authenticated, send to home
      //::Only if not on verify email page for some UX issues
      if (isAuthenticated && pathname !== "/verify-email") {
        router.replace("/");

        toast.info("Already signed in");

        return;
      }

      //::Coming from non-auth page; set redirect
      if (!hasRedirectParam && prevPath && !AUTH_PAGES.includes(prevPath)) {
        const redirectPath = encodeURIComponent(prevPath);
        router.replace(`${pathname}?redirect=${redirectPath}`);
      }

      //::Coming from another auth page; preserve existing redirect param
      else if (!hasRedirectParam && prevRedirect) {
        router.replace(
          `${pathname}?redirect=${encodeURIComponent(prevRedirect)}`
        );
      }
    }

    //NON-AUTH AND NON-PROTECTED PAGES
    //::Clear redirect param if exists
    if (!isAuthPage && !isProtected && hasRedirectParam) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("redirect");
      const newUrl = pathname + (newParams.size ? `?${newParams}` : "");
      router.replace(newUrl);
    }

    //::Save current path & redirect for next navigation
    prevPathRef.current = pathname;
    if (hasRedirectParam) {
      prevRedirectRef.current = searchParams.get("redirect");
    }
  }, [pathname, searchParams, isAuthenticated, router]);

  return <>{children}</>;
}
