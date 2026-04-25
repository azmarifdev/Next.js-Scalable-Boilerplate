import { getTranslations } from "next-intl/server";

import { getFeatureFlags } from "@/lib/config/featureFlags";
import { BillingPanel } from "@/modules/optional/billing/components/BillingPanel";

export default async function BillingPage() {
  const featureFlags = getFeatureFlags();
  const t = await getTranslations("dashboard");

  if (!featureFlags.ENABLE_BILLING) {
    return null;
  }

  return (
    <div className="stack">
      <h1 className="card-title">{t("billingNav")}</h1>
      <BillingPanel />
    </div>
  );
}
