import { getTranslations } from "next-intl/server";

import { EmptyState } from "@/components/common/empty-state";
import { isFeatureEnabled } from "@/lib/config/feature-flags";
import { BillingPanel } from "@/modules/billing/components/BillingPanel";

export default async function BillingPage() {
  const t = await getTranslations("dashboard");

  if (!isFeatureEnabled("billing")) {
    return (
      <div className="stack">
        <EmptyState
          title="Billing feature disabled"
          description="Enable NEXT_PUBLIC_FEATURE_BILLING to access billing."
        />
      </div>
    );
  }

  return (
    <div className="stack">
      <h1 className="card-title">{t("billingNav")}</h1>
      <BillingPanel />
    </div>
  );
}
