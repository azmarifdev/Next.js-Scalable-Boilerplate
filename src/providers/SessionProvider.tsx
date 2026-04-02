"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

import { appConfig } from "@/lib/config/app-config";

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps): ReactNode {
  if (appConfig.authProvider !== "nextauth") {
    return children;
  }

  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
