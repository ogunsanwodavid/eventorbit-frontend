"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RootState } from "../redux/store";
import { useAppSelector } from "../hooks/global/redux";

const AUTH_PAGES = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/set-password",
  "/verify-email", // fixed missing slash
];
const PROTECTED_PATHS = ["/dashboard", "/profile", "/settings"];

export default function RedirectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const prevPathRef = useRef<string | null>(null);
  const prevRedirectRef = useRef<string | null>(null);

  useEffect(() => {
    const isAuthPage = AUTH_PAGES.includes(pathname);
    const isProtected = PROTECTED_PATHS.some((path) =>
      pathname.startsWith(path)
    );
    const prevPath = prevPathRef.current;
    const prevRedirect = prevRedirectRef.current;
    const hasRedirectParam = searchParams?.has("redirect");

    // 1️⃣ Protect pages: redirect to sign-in with proper redirect
    if (isProtected && !isAuthenticated) {
      const redirectPath = encodeURIComponent(
        pathname + (searchParams?.toString() ? `?${searchParams}` : "")
      );
      router.replace(`/sign-in?redirect=${redirectPath}`);
      return;
    }

    // 2️⃣ Auth pages: set redirect param when needed
    if (isAuthPage) {
      // Coming from non-auth page → set redirect
      if (!hasRedirectParam && prevPath && !AUTH_PAGES.includes(prevPath)) {
        const redirectPath = encodeURIComponent(prevPath);
        router.replace(`${pathname}?redirect=${redirectPath}`);
      }
      // Coming from another auth page → preserve existing redirect param
      else if (!hasRedirectParam && prevRedirect) {
        router.replace(
          `${pathname}?redirect=${encodeURIComponent(prevRedirect)}`
        );
      }
    }

    // 3️⃣ Non-auth, non-protected pages → clear redirect param if exists
    if (!isAuthPage && !isProtected && hasRedirectParam) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("redirect");
      const newUrl = pathname + (newParams.size ? `?${newParams}` : "");
      router.replace(newUrl);
    }

    // Save current path & redirect for next navigation
    prevPathRef.current = pathname;
    if (hasRedirectParam) {
      prevRedirectRef.current = searchParams.get("redirect");
    }
  }, [pathname, searchParams, isAuthenticated, router]);

  return <>{children}</>;
}
