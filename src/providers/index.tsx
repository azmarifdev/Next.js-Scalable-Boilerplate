"use client";

import { ReactNode } from "react";

import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ToastProvider } from "@/providers/ToastProvider";

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
