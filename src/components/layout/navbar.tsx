"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { LangSwitcher } from "@/components/layout/lang-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth.hook";
import { APP_NAME } from "@/lib/config/constants";

export function Navbar() {
  const t = useTranslations("common");
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="topbar">
      <div className="topbar-inner container">
        <Link href="/dashboard" className="brand-link">
          {APP_NAME}
        </Link>

        <div className="topbar-actions">
          <LangSwitcher />
          <ThemeSwitcher />
          {isAuthenticated ? (
            <>
              <span className="badge">{user?.name}</span>
              <Button variant="danger" onClick={handleLogout} disabled={isLoggingOut}>
                {t("logout")}
              </Button>
            </>
          ) : (
            <Link href="/login" className="link-inline">
              {t("login")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
