"use client";

import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const toggleLocale = (): void => {
    const nextLocale = locale === "en" ? "bn" : "en";
    document.cookie = `NEXT_LOCALE=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <Button variant="secondary" onClick={toggleLocale} aria-label="Toggle language">
      <span className="icon-inline icon-gap-sm">
        <Languages size={16} />
      </span>
      {locale.toUpperCase()}
    </Button>
  );
}
