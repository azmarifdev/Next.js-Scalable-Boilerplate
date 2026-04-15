"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAppTheme } from "@/providers/theme.provider";

export function ThemeSwitcher() {
  const { theme, setTheme } = useAppTheme();

  const toggleTheme = (): void => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="secondary" onClick={toggleTheme} aria-label="Toggle theme">
      <Sun size={16} className="theme-icon-sun" suppressHydrationWarning />
      <Moon size={16} className="theme-icon-moon" suppressHydrationWarning />
    </Button>
  );
}
