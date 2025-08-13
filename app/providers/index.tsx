import { ReactNode } from "react";

import QueryProvider from "./QueryProvider";
import ReduxProvider from "./ReduxProvider";
import AuthProvider from "./AuthProvider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <ReduxProvider>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </ReduxProvider>
    </>
  );
}
