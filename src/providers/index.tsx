"use client";

import { ReactNode } from "react";

import { AuthProvider } from "@/providers/auth.provider";
import { FeatureFlagsProvider } from "@/providers/feature-flags.provider";
import { QueryProvider } from "@/providers/query.provider";
import { ThemeProvider } from "@/providers/theme.provider";
import { ToastProvider } from "@/providers/toast.provider";

export function AppProviders({
  children,
  initialTheme
}: {
  children: ReactNode;
  initialTheme?: "light" | "dark";
}): ReactNode {
  return (
    <FeatureFlagsProvider>
      <QueryProvider>
        <ThemeProvider initialTheme={initialTheme}>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </QueryProvider>
    </FeatureFlagsProvider>
  );
}
