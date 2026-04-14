import { ArrowRight, Globe, Sparkles } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { LangSwitcher } from "@/components/layout/lang-switcher";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { appConfig } from "@/lib/config/app-config";

export default async function HomePage() {
  const t = await getTranslations("home");
  const getStartedHref = appConfig.authProvider === "nextauth" ? "/login" : "/register";

  return (
    <main className="landing-wrap">
      <header className="showcase-topbar">
        <div className="showcase-topbar-inner container">
          <p className="showcase-brand">Azmarif Dev</p>
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
          <Sparkles size={14} />
          {t("badge")}
        </p>
        <h1 className="showcase-title">
          <span>Next.js</span> {t("titleSuffix")}
        </h1>
        <p className="showcase-subtitle">{t("subtitle")}</p>
        <p className="showcase-meta">
          <Globe size={14} /> {t("meta")}
        </p>
        <div className="showcase-actions">
          <Link className="showcase-btn-primary" href={getStartedHref}>
            {t("getStarted")} <ArrowRight size={15} />
          </Link>
          <a
            className="showcase-btn-secondary"
            href="https://github.com/azmarifdev/nextjs-starter-template"
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
