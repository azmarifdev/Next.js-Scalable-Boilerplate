import { getTranslations } from "next-intl/server";

import { featureFlags } from "@/lib/config/featureFlags";
import { BillingPanel } from "@/modules/optional/billing/components/BillingPanel";

export default async function BillingPage() {
  if (!featureFlags.ENABLE_BILLING) return null;
  const t = await getTranslations("dashboard");

  return (
    <div className="stack">
      <h1 className="card-title">{t("billingNav")}</h1>
      <BillingPanel />
    </div>
  );
}
