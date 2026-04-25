import { getTranslations } from "next-intl/server";

import { isFeatureEnabled } from "@/lib/config/featureFlags";
import { BillingPanel } from "@/modules/optional/billing/components/BillingPanel";

export default async function BillingPage() {
  const t = await getTranslations("dashboard");

  if (!isFeatureEnabled("ENABLE_BILLING")) {
    return null;
  }

  return (
    <div className="stack">
      <h1 className="card-title">{t("billingNav")}</h1>
      <BillingPanel />
    </div>
  );
}
