"use client";

import { ReactNode } from "react";

import { AuthProvider } from "@/providers/auth.provider";
import { QueryProvider } from "@/providers/query.provider";
import { ReduxProvider } from "@/providers/redux.provider";
import { SessionProvider } from "@/providers/session.provider";
import { ThemeProvider } from "@/providers/theme.provider";
import { ToastProvider } from "@/providers/toast.provider";

export function AppProviders({ children }: { children: ReactNode }): ReactNode {
  return (
    <SessionProvider>
      <QueryProvider>
        <ReduxProvider>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>{children}</AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </ReduxProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
