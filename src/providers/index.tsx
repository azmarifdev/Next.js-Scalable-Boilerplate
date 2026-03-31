"use client";

import { ReactNode } from "react";

import { AuthProvider } from "@/providers/AuthProvider";
import { ReduxProvider } from "@/providers/ReduxProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";

export function AppProviders({ children }: { children: ReactNode }): ReactNode {
  return (
    <ReduxProvider>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
