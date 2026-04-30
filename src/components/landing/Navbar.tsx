"use client";

import { Moon, Sun, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { useAppTheme } from "@/providers/theme.provider";

const navItems = [
  { key: "features", href: "/features" },
  { key: "docs", href: "/docs" }
] as const;

export function Navbar() {
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();
  const { theme, setTheme } = useAppTheme();
  const [isLangAnimating, setIsLangAnimating] = useState(false);
  const [isThemeAnimating, setIsThemeAnimating] = useState(false);
  const langAnimationTimeoutRef = useRef<number | null>(null);
  const themeAnimationTimeoutRef = useRef<number | null>(null);

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

  const handleLanguageToggle = (): void => {
    if (isLangAnimating) {
      return;
    }

    setIsLangAnimating(true);
    const nextLocale = locale === "en" ? "bn" : "en";
    const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax${secureFlag}`;

    if (langAnimationTimeoutRef.current) {
      window.clearTimeout(langAnimationTimeoutRef.current);
    }
    langAnimationTimeoutRef.current = window.setTimeout(() => setIsLangAnimating(false), 240);
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
    <header className="sticky top-0 z-30 border-b border-[var(--landing-border)] bg-[var(--landing-surface)]/92 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl">
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
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="relative inline-flex h-8 w-[58px] items-center rounded-full bg-[linear-gradient(135deg,#6d5cff_0%,#4f74df_100%)] p-1 shadow-[0_10px_24px_rgba(79,116,223,0.28)] transition duration-200 hover:brightness-105"
            aria-label={locale === "en" ? "Switch to Bangla" : "Switch to English"}
            title={locale === "en" ? "Switch to Bangla" : "Switch to English"}
            aria-pressed={locale === "bn"}
          >
            <span
              className={`absolute left-2 text-[12px] leading-none transition-opacity duration-200 ${locale === "en" ? "opacity-0" : "opacity-90"}`}
              aria-hidden
            >
              🇬🇧
            </span>
            <span
              className={`absolute right-2 text-[12px] leading-none transition-opacity duration-200 ${locale === "bn" ? "opacity-0" : "opacity-90"}`}
              aria-hidden
            >
              🇧🇩
            </span>
            <span
              className={`absolute top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[13px] shadow-sm transition-all duration-200 ${
                locale === "en" ? "left-1" : "left-[30px]"
              } ${isLangAnimating ? "scale-110" : ""}`}
              aria-hidden
            >
              {locale === "en" ? "🇬🇧" : "🇧🇩"}
            </span>
          </button>

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

          <Link
            className="hidden rounded-2xl bg-[var(--landing-surface-soft)] px-4 py-2.5 text-sm font-medium text-[var(--landing-text-strong)] shadow-[0_8px_20px_rgba(15,23,42,0.10),inset_0_1px_0_rgba(255,255,255,0.20)] transition duration-200 hover:bg-white/[0.06] md:inline-flex"
            href="/login"
          >
            {t("signIn")}
          </Link>

          <Link
            className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#9b3dff_0%,#d946ef_40%,#fb7185_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(217,70,239,0.36)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_16px_36px_rgba(236,72,153,0.40)] sm:px-6"
            href="/register"
          >
            {t("getStarted")}
          </Link>
        </div>
      </div>
    </header>
  );
}
