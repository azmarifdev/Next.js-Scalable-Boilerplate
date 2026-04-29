import { ArrowUpRight, BookOpenText } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Navbar } from "@/components/landing/Navbar";

const docsHrefs = [
  "https://github.com/azmarifdev/next-js-boilerplate-postgresql-drizzle/blob/main/docs/how-to-use.md",
  "https://github.com/azmarifdev/next-js-boilerplate-postgresql-drizzle/blob/main/docs/architecture.md",
  "https://github.com/azmarifdev/next-js-boilerplate-postgresql-drizzle/blob/main/docs/folder-structure.md",
  "https://github.com/azmarifdev/next-js-boilerplate-postgresql-drizzle/blob/main/docs/auth-flow.md",
  "https://github.com/azmarifdev/next-js-boilerplate-postgresql-drizzle/blob/main/docs/workflows.md",
  "https://github.com/azmarifdev/next-js-boilerplate-postgresql-drizzle/blob/main/docs/guides/README.md"
] as const;

export default async function DocsPage() {
  const t = await getTranslations("home.docsPage");
  const docsLinks = t.raw("items") as Array<{ title: string; description: string }>;

  return (
    <main className="landing-shell h-screen overflow-hidden">
      <Navbar />
      <section className="relative h-[calc(100vh-64px)] overflow-hidden px-4 pt-4 pb-6 sm:px-6 sm:pt-5 lg:px-8">
        <div className="absolute inset-0">
          <div className="absolute top-[20%] left-[12%] h-40 w-40 rounded-full bg-[#5b6bff]/28 blur-[90px]" />
          <div className="absolute top-[18%] right-[8%] h-40 w-40 rounded-full bg-[#ff4fcf]/30 blur-[84px]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--landing-overlay-top)_0%,var(--landing-overlay-mid)_60%,var(--landing-overlay-bottom)_100%)]" />
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-[1100px] flex-col">
          <div className="flex flex-1 flex-col justify-center">
            <div className="mx-auto max-w-[820px] text-center">
              <p className="text-sm font-medium tracking-[0.2em] text-fuchsia-300 uppercase">
                {t("eyebrow")}
              </p>
              <h1 className="mt-3 text-[1.9rem] font-semibold tracking-[-0.04em] text-[var(--landing-text-strong)] sm:text-[2.4rem]">
                {t("title")}
              </h1>
              <p className="mt-3 text-[0.9rem] leading-[1.5] text-[var(--landing-muted)] sm:text-[0.96rem]">
                {t("description")}
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {docsLinks.map((item, index) => (
                <a
                  key={item.title}
                  href={docsHrefs[index]}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-[22px] bg-[linear-gradient(180deg,var(--landing-panel-start),var(--landing-panel-end))] p-4 shadow-[0_16px_56px_rgba(8,5,24,0.12)] transition duration-200 hover:bg-white/[0.03]"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--landing-icon-surface)] shadow-[0_0_24px_rgba(129,44,248,0.18)]">
                      <BookOpenText className="h-4 w-4 text-fuchsia-300" strokeWidth={2} />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[var(--landing-muted)] transition duration-200 group-hover:text-[var(--landing-text-strong)]" />
                  </div>
                  <h2 className="mt-3 text-[1rem] font-semibold tracking-[-0.02em] text-[var(--landing-text-strong)]">
                    {item.title}
                  </h2>
                  <p className="mt-1.5 text-[0.86rem] leading-[1.5] text-[var(--landing-soft)]">
                    {item.description}
                  </p>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-auto flex justify-center pb-2">
            <Link
              href="/features"
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
