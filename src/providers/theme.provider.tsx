"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type AppTheme = "light" | "dark";

interface ThemeContextValue {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

const THEME_STORAGE_KEY = "app-theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): AppTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark" || savedTheme === "light") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }): ReactNode {
  const [theme, setThemeState] = useState<AppTheme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (nextTheme: AppTheme): void => {
    setThemeState(nextTheme);
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }

  return context;
}
