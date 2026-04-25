"use client";

import { ReactNode } from "react";

import { AuthProvider } from "@/providers/auth.provider";
import { QueryProvider } from "@/providers/query.provider";
import { ThemeProvider } from "@/providers/theme.provider";
import { ToastProvider } from "@/providers/toast.provider";

export function AppProviders({ children }: { children: ReactNode }): ReactNode {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>{children}</AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
