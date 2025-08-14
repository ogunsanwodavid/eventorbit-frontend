import { ReactNode } from "react";

import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";
import AuthProvider from "./AuthProvider";
import RedirectProvider from "./RedirectProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <ReduxProvider>
        <QueryProvider>
          <AuthProvider>
            <RedirectProvider>{children}</RedirectProvider>
          </AuthProvider>
        </QueryProvider>
      </ReduxProvider>
    </>
  );
}
