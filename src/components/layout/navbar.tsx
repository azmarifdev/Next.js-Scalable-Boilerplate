"use client";

import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/lib/constants";

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  const toggleTheme = (): void => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <header className="topbar">
      <div className="topbar-inner container">
        <Link href="/dashboard" className="brand-link">
          {APP_NAME}
        </Link>

        <div className="topbar-actions">
          <Button variant="secondary" onClick={toggleTheme} aria-label="Toggle theme">
            {resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
          {isAuthenticated ? (
            <>
              <span className="badge">{user?.name}</span>
              <Button variant="danger" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login" className="link-inline">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
