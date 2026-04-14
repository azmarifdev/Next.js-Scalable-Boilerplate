"use client";

import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/common/skeleton";
import { useBillingSummary } from "@/modules/billing/hooks/use-billing-summary.hook";

export function BillingPanel() {
  const t = useTranslations("billing");
  const { summary, isLoading, isError } = useBillingSummary();

  if (isLoading) {
    return <Skeleton lines={3} />;
  }

  if (isError || !summary) {
    return <EmptyState title={t("errorTitle")} description={t("errorDescription")} />;
  }

  return (
    <section className="grid-two">
      <article className="card">
        <h2 className="card-title text-title-sm">{t("activePlans")}</h2>
        <p className="card-subtitle">{summary.activePlans}</p>
      </article>

      <article className="card">
        <h2 className="card-title text-title-sm">{t("mrr")}</h2>
        <p className="card-subtitle">${summary.mrr.toLocaleString()}</p>
      </article>
    </section>
  );
}
