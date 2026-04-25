import { getTranslations } from "next-intl/server";

import { isFeatureEnabled } from "@/lib/config/featureFlags";
import { EcommercePanel } from "@/modules/optional/ecommerce/components/EcommercePanel";

export default async function EcommercePage() {
  const t = await getTranslations("dashboard");

  if (!isFeatureEnabled("ENABLE_ECOMMERCE")) {
    return null;
  }

  return (
    <div className="stack">
      <h1 className="card-title">{t("ecommerceNav")}</h1>
      <EcommercePanel />
    </div>
  );
}
