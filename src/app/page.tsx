import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");

  return (
    <main className="page-section container">
      <section className="card stack">
        <h1 className="card-title">{t("title")}</h1>
        <p className="help-text">{t("subtitle")}</p>
        <div className="topbar-actions">
          <Link className="btn btn-primary" href="/login">
            Login
          </Link>
          <Link className="btn btn-secondary" href="/register">
            Register
          </Link>
        </div>
      </section>
    </main>
  );
}
