import {
  Blocks,
  Container,
  Database,
  Languages,
  ScrollText,
  ShieldCheck,
  TestTube,
  Workflow,
  Zap
} from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Navbar } from "@/components/landing/Navbar";

const featureIcons = [
  Blocks,
  Database,
  ShieldCheck,
  Workflow,
  Languages,
  ScrollText,
  TestTube,
  Container,
  Zap
] as const;

export default async function FeaturesPage() {
  const t = await getTranslations("home.featuresPage");
  const featureItems = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <main className="landing-shell docs-shared-gradient min-h-screen overflow-x-clip">
      <Navbar />
      <section className="relative min-h-[calc(100vh-64px)] overflow-y-auto px-4 pt-4 pb-10 sm:px-6 sm:pt-5 lg:px-8">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="mx-auto max-w-[840px] text-center">
            <p className="text-xs font-semibold tracking-[0.24em] text-fuchsia-300 uppercase">
              {t("eyebrow")}
            </p>
            <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.03em] text-[var(--landing-text-strong)] sm:text-[2.7rem]">
              {t("title")}
            </h1>
            <p className="mt-3 text-[0.96rem] leading-[1.7] text-[var(--landing-muted)]">
              {t("description")}
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featureItems.map((item, index) => {
              const Icon = featureIcons[index];

              return (
                <article
                  key={item.title}
                  className="rounded-[22px] bg-[linear-gradient(180deg,var(--landing-panel-start),var(--landing-panel-end))] p-4 shadow-[0_18px_60px_rgba(8,5,24,0.12)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--landing-icon-surface)] shadow-[0_0_28px_rgba(129,44,248,0.2)]">
                    {Icon ? <Icon className="h-4 w-4 text-fuchsia-300" strokeWidth={2} /> : null}
                  </div>
                  <h2 className="mt-3 text-[1rem] font-semibold tracking-[-0.02em] text-[var(--landing-text-strong)]">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 text-[0.86rem] leading-[1.5] text-[var(--landing-soft)]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#8b3dff_0%,#d946ef_48%,#fb7185_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_38px_rgba(217,70,239,0.32)] transition duration-200 hover:-translate-y-0.5"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
