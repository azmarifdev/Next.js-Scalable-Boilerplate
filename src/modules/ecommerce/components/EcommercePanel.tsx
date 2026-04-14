"use client";

import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/common/empty-state";
import { Skeleton } from "@/components/common/skeleton";
import { useEcommerceSummary } from "@/modules/ecommerce/hooks/use-ecommerce-summary.hook";

export function EcommercePanel() {
  const t = useTranslations("ecommerce");
  const { summary, isLoading, isError } = useEcommerceSummary();

  if (isLoading) {
    return <Skeleton lines={3} />;
  }

  if (isError || !summary) {
    return <EmptyState title={t("errorTitle")} description={t("errorDescription")} />;
  }

  return (
    <section className="grid-two">
      <article className="card">
        <h2 className="card-title text-title-sm">{t("orders")}</h2>
        <p className="card-subtitle">{summary.orders}</p>
      </article>

      <article className="card">
        <h2 className="card-title text-title-sm">{t("revenue")}</h2>
        <p className="card-subtitle">${summary.revenue.toLocaleString()}</p>
      </article>
    </section>
  );
}
