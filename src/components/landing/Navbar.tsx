"use client";

import { LogOut, Moon, Sun, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { locales } from "@/i18n/routing";
import { useAppTheme } from "@/providers/theme.provider";

/** Map of locale codes → display label + flag emoji. */
const LOCALE_META: Record<string, { label: string; flag: string }> = {
  en: { label: "English", flag: "🇬🇧" },
  bn: { label: "বাংলা", flag: "🇧🇩" },
  es: { label: "Español", flag: "🇪🇸" },
  fr: { label: "Français", flag: "🇫🇷" },
  de: { label: "Deutsch", flag: "🇩🇪" },
  hi: { label: "हिन्दी", flag: "🇮🇳" },
  ja: { label: "日本語", flag: "🇯🇵" },
  ar: { label: "العربية", flag: "🇸🇦" }
};

const navItems = [
  { key: "features", href: "/features" },
  { key: "docs", href: "/docs" }
] as const;

export function Navbar() {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();
  const { theme, setTheme } = useAppTheme();
  const { isAuthenticated, logout, isLoggingOut } = useAuth();
  const [isLangAnimating, setIsLangAnimating] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isThemeAnimating, setIsThemeAnimating] = useState(false);
  const langAnimationTimeoutRef = useRef<number | null>(null);
  const themeAnimationTimeoutRef = useRef<number | null>(null);
  const langDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (langAnimationTimeoutRef.current) {
        window.clearTimeout(langAnimationTimeoutRef.current);
      }
      if (themeAnimationTimeoutRef.current) {
        window.clearTimeout(themeAnimationTimeoutRef.current);
      }
    };
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLocale = (nextLocale: string): void => {
    setIsLangAnimating(true);
    const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax${secureFlag}`;

    if (langAnimationTimeoutRef.current) {
      window.clearTimeout(langAnimationTimeoutRef.current);
    }
    langAnimationTimeoutRef.current = window.setTimeout(() => setIsLangAnimating(false), 240);
    setIsLangOpen(false);
    router.refresh();
  };

  const handleThemeToggle = (): void => {
    if (isThemeAnimating) {
      return;
    }

    setIsThemeAnimating(true);
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    if (themeAnimationTimeoutRef.current) {
      window.clearTimeout(themeAnimationTimeoutRef.current);
    }
    themeAnimationTimeoutRef.current = window.setTimeout(() => setIsThemeAnimating(false), 240);
  };

  return (
    <header className="landing-nav sticky top-0 z-30 border-b bg-[var(--landing-surface)]/92 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-[1560px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link className="flex min-w-0 items-center gap-2.5" href="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,rgba(232,121,249,0.25),rgba(124,58,237,0.08))] shadow-[0_0_32px_rgba(217,70,239,0.28)]">
            <Zap className="h-5 w-5 text-fuchsia-300" strokeWidth={2.2} />
          </span>
          <span className="truncate text-base font-semibold tracking-[-0.03em] text-[var(--landing-text-strong)] sm:text-[18px] xl:text-[19px]">
            Next.js Boilerplate
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-[15px] text-[var(--landing-muted)] lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="transition duration-200 hover:text-[var(--landing-text-strong)]"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setIsLangOpen((v) => !v)}
              className="inline-flex h-8 w-[58px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#6d5cff_0%,#4f74df_100%)] p-1 shadow-[0_10px_24px_rgba(79,116,223,0.28)] transition duration-200 hover:brightness-105"
              aria-label="Switch language"
              title={LOCALE_META[locale]?.label ?? locale}
            >
              <span className="text-[14px] leading-none">{LOCALE_META[locale]?.flag ?? "🌐"}</span>
            </button>

            {isLangOpen && (
              <div className="absolute top-full right-0 z-50 mt-1.5 min-w-[150px] overflow-hidden rounded-xl border border-[var(--landing-border)] bg-[var(--landing-surface)] shadow-[0_14px_45px_rgba(15,23,42,0.18)]">
                {locales.map((code) => {
                  const meta = LOCALE_META[code] ?? { label: code, flag: "🌐" };
                  const isActive = code === locale;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => switchLocale(code)}
                      disabled={isLangAnimating || isActive}
                      className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm transition ${
                        isActive
                          ? "bg-[var(--landing-surface-soft)] font-semibold text-[var(--landing-text-strong)]"
                          : "text-[var(--landing-muted)] hover:bg-[var(--landing-surface-soft)] hover:text-[var(--landing-text-strong)]"
                      }`}
                    >
                      <span className="text-[14px]">{meta.flag}</span>
                      <span>{meta.label}</span>
                      {isActive && <span className="ml-auto text-[10px] opacity-50">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleThemeToggle}
            className="relative inline-flex h-8 w-[58px] items-center rounded-full bg-[linear-gradient(135deg,#6d5cff_0%,#4f74df_100%)] p-1 shadow-[0_10px_24px_rgba(79,116,223,0.28)] transition duration-200 hover:brightness-105"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={theme === "dark"}
          >
            <span
              className={`absolute left-2 text-white/90 transition-opacity duration-200 ${theme === "dark" ? "opacity-0" : "opacity-90"}`}
              aria-hidden
            >
              <Moon className="h-3.5 w-3.5" />
            </span>
            <span
              className={`absolute right-2 text-white/90 transition-opacity duration-200 ${theme === "light" ? "opacity-0" : "opacity-90"}`}
              aria-hidden
            >
              <Sun className="h-3.5 w-3.5" />
            </span>
            <span
              className={`absolute top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#6d5cff] shadow-sm transition-all duration-200 ${
                theme === "dark" ? "left-1" : "left-[30px]"
              } ${isThemeAnimating ? "scale-110" : ""}`}
              aria-hidden
            >
              {theme === "dark" ? (
                <Moon className="h-3.5 w-3.5" />
              ) : (
                <Sun className="h-3.5 w-3.5" />
              )}
            </span>
          </button>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/");
                router.refresh();
              }}
              disabled={isLoggingOut}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--landing-surface-soft)] px-5 py-2.5 text-sm font-medium text-[var(--landing-text-strong)] shadow-[0_8px_20px_rgba(15,23,42,0.10),inset_0_1px_0_rgba(255,255,255,0.20)] transition duration-200 hover:bg-white/[0.06]"
            >
              <LogOut className="h-4 w-4" />
              {t("signOut")}
            </button>
          ) : (
            <>
              <Link
                className="hidden rounded-2xl bg-[var(--landing-surface-soft)] px-4 py-2.5 text-sm font-medium text-[var(--landing-text-strong)] shadow-[0_8px_20px_rgba(15,23,42,0.10),inset_0_1px_0_rgba(255,255,255,0.20)] transition duration-200 hover:bg-white/[0.06] md:inline-flex"
                href="/login"
              >
                {t("signIn")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
