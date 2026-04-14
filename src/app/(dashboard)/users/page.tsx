import { getTranslations } from "next-intl/server";

import { EmptyState } from "@/components/common/empty-state";
import { isFeatureEnabled } from "@/lib/config/feature-flags";
import { UserTable } from "@/modules/user/components/UserTable";

export default async function UsersPage() {
  const t = await getTranslations("dashboard");
  const usersEnabled = isFeatureEnabled("admin");

  if (!usersEnabled) {
    return (
      <div className="stack">
        <EmptyState
          title="Admin feature disabled"
          description="Enable NEXT_PUBLIC_FEATURE_ADMIN to access users."
        />
      </div>
    );
  }

  return (
    <div className="stack">
      <h1 className="card-title">{t("usersNav")}</h1>
      <UserTable />
    </div>
  );
}
