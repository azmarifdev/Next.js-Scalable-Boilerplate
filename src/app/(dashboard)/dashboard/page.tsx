import { getTranslations } from "next-intl/server";

import { isFeatureEnabled } from "@/lib/config/featureFlags";

export default async function DashboardMainPage() {
  const t = await getTranslations("dashboard");
  const billingEnabled = isFeatureEnabled("ENABLE_BILLING");
  const ecommerceEnabled = isFeatureEnabled("ENABLE_ECOMMERCE");

  return (
    <div className="stack">
      <section className="card">
        <h1 className="card-title">{t("overviewTitle")}</h1>
        <p className="card-subtitle">{t("overviewSubtitle")}</p>
      </section>

      <section className="grid-two">
        <article className="card">
          <h2 className="card-title text-title-sm">{t("projectsTitle")}</h2>
          <p className="help-text">{t("projectsSubtitle")}</p>
        </article>

        <article className="card">
          <h2 className="card-title text-title-sm">{t("tasksTitle")}</h2>
          <p className="help-text">{t("tasksSubtitle")}</p>
        </article>

        {ecommerceEnabled ? (
          <article className="card">
            <h2 className="card-title text-title-sm">{t("ecommerceTitle")}</h2>
            <p className="help-text">{t("ecommerceSubtitle")}</p>
          </article>
        ) : null}

        {billingEnabled ? (
          <article className="card">
            <h2 className="card-title text-title-sm">{t("billingTitle")}</h2>
            <p className="help-text">{t("billingSubtitle")}</p>
          </article>
        ) : null}
      </section>
    </div>
  );
}
