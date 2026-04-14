import { getTranslations } from "next-intl/server";

import { EmptyState } from "@/components/common/empty-state";
import { isFeatureEnabled } from "@/lib/config/feature-flags";
import { EcommercePanel } from "@/modules/ecommerce/components/EcommercePanel";

export default async function EcommercePage() {
  const t = await getTranslations("dashboard");

  if (!isFeatureEnabled("ecommerce")) {
    return (
      <div className="stack">
        <EmptyState
          title="Ecommerce feature disabled"
          description="Enable NEXT_PUBLIC_FEATURE_ECOMMERCE to access ecommerce."
        />
      </div>
    );
  }

  return (
    <div className="stack">
      <h1 className="card-title">{t("ecommerceNav")}</h1>
      <EcommercePanel />
    </div>
  );
}
