import { ReactNode } from "react";

import { AuthProvider } from "../contexts/AuthContext";
import { NavFooterVisibilityProvider } from "../contexts/NavFooterVisibilityContext";

import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";
import RedirectProvider from "./RedirectProvider";
import OnboardingProvider from "./OnboardingProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <ReduxProvider>
        <QueryProvider>
          <AuthProvider>
            <OnboardingProvider>
            <RedirectProvider>
              <NavFooterVisibilityProvider>
                {children}
              </NavFooterVisibilityProvider>
            </RedirectProvider>
            </OnboardingProvider>
          </AuthProvider>
        </QueryProvider>
      </ReduxProvider>
    </>
  );
}
