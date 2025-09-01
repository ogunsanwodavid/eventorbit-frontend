"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { usePathname } from "next/navigation";

type NavFooterVisibilityContextType = {
  showNav: boolean;
  showFooter: boolean;
  setShowNav: (value: boolean) => void;
  setShowFooter: (value: boolean) => void;
};

//Pages where nav or footer should be hidden
const navHiddenRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/set-password",
  "/verify-email",
];

const footerHiddenRoutes = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/set-password",
  "/verify-email",
  "/settings",
];

const NavFooterVisibilityContext = createContext<
  NavFooterVisibilityContextType | undefined
>(undefined);

export const NavFooterVisibilityProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  //Pathname function
  const pathname = usePathname();

  //Nav and footer visibility
  const [showNav, setShowNav] = useState(true);
  const [showFooter, setShowFooter] = useState(true);

  //Last pathname
  const [lastPath, setLastPath] = useState(pathname);

  //Auto-toggle visibility whenever pathname changes
  useEffect(() => {
    if (!pathname) return;

    //Don't reset if pathname hasn't changed
    if (pathname === lastPath) return;

    //Set last pathname
    setLastPath(pathname);

    setShowNav(!navHiddenRoutes.some((route) => pathname.startsWith(route)));
    setShowFooter(
      !footerHiddenRoutes.some((route) => pathname.startsWith(route))
    );
  }, [pathname, lastPath]);

  return (
    <NavFooterVisibilityContext.Provider
      value={{
        showNav,
        showFooter,
        setShowNav,
        setShowFooter,
      }}
    >
      {children}
    </NavFooterVisibilityContext.Provider>
  );
};

export const useNavFooterVisibility = () => {
  const context = useContext(NavFooterVisibilityContext);
  if (!context) {
    throw new Error(
      "useNavFooterVisibility must be used within a NavFooterVisibilityProvider"
    );
  }
  return context;
};
