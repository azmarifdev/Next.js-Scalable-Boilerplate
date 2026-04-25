import { ArrowRight, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { LangSwitcher } from "@/components/layout/lang-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main className="landing-wrap">
      <header className="showcase-topbar">
        <div className="showcase-topbar-inner container">
          <p className="showcase-brand">Next.js-Boilerplate-PostgresQL-Drizzle</p>
          <div className="showcase-topbar-actions">
            <LangSwitcher />
            <ThemeSwitcher />
            <Link className="showcase-signin" href="/login">
              {t("signIn")}
            </Link>
          </div>
        </div>
      </header>

      <section className="showcase-hero container">
        <p className="showcase-badge">
          <Sparkles size={14} suppressHydrationWarning />
          {t("badge")}
        </p>
        <h1 className="showcase-title">
          <span>Next.js</span> {t("titleSuffix")}
        </h1>
        <p className="showcase-subtitle">{t("subtitle")}</p>
        <p className="showcase-meta">
          <Globe size={14} suppressHydrationWarning /> {t("meta")}
        </p>
        <div className="showcase-actions">
          <Link className="showcase-btn-primary" href="/register">
            {t("getStarted")} <ArrowRight size={15} suppressHydrationWarning />
          </Link>
          <a
            className="showcase-btn-secondary"
            href="https://github.com/azmarifdev/next-js-boilerplate-postgresql-drizzle"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </section>
    </main>
  );
}
