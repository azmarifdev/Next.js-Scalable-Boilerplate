"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = (): void => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="secondary" onClick={toggleTheme} aria-label="Toggle theme">
      {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </Button>
  );
}
