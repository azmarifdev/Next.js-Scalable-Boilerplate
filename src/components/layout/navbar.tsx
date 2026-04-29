"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/lib/config/constants";
import { useAppTheme } from "@/providers/theme.provider";

export function Navbar() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const { theme, setTheme } = useAppTheme();
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth();

  const handleLogout = async (): Promise<void> => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  const handleLanguageToggle = (): void => {
    const nextLocale = locale === "en" ? "bn" : "en";
    const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax${secureFlag}`;
    router.refresh();
  };

  const handleThemeToggle = (): void => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="topbar">
      <div className="topbar-inner container">
        <Link href="/dashboard" className="brand-link">
          {APP_NAME}
        </Link>

        <div className="topbar-actions">
          <Button variant="secondary" onClick={handleLanguageToggle} type="button">
            {locale === "en" ? "BN" : "EN"}
          </Button>
          <Button variant="secondary" onClick={handleThemeToggle} type="button">
            {theme === "dark" ? t("lightMode") : t("darkMode")}
          </Button>
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
