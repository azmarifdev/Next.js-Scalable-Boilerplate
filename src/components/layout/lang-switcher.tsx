"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function LangSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();

  const toggleLocale = (): void => {
    const nextLocale = locale === "en" ? "bn" : "en";
    const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax${secureFlag}`;
    router.refresh();
  };

  return (
    <Button variant="secondary" onClick={toggleLocale} aria-label={t("toggleLanguage")}>
      <span className="icon-inline icon-gap-sm">
        <Languages size={16} suppressHydrationWarning />
      </span>
      {locale.toUpperCase()}
    </Button>
  );
}
