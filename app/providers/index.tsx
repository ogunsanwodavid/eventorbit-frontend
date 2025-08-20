import { ReactNode } from "react";

import { AuthProvider } from "../contexts/AuthContext";

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
              <RedirectProvider>{children}</RedirectProvider>
            </OnboardingProvider>
          </AuthProvider>
        </QueryProvider>
      </ReduxProvider>
    </>
  );
}
