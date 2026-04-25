import { getTranslations } from "next-intl/server";

import { featureFlags } from "@/lib/config/featureFlags";
import { EcommercePanel } from "@/modules/optional/ecommerce/components/EcommercePanel";

export default async function EcommercePage() {
  if (!featureFlags.ENABLE_ECOMMERCE) {
    return null;
  }
  const t = await getTranslations("dashboard");

  return (
    <div className="stack">
      <h1 className="card-title">{t("ecommerceNav")}</h1>
      <EcommercePanel />
    </div>
  );
}
