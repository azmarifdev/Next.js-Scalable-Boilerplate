import { ArrowUpRight, BookOpenText, ChevronRight, Clock3 } from "lucide-react";
import Link from "next/link";
import { getLocale } from "next-intl/server";

import { Navbar } from "@/components/landing/Navbar";
import { getGithubHref, getLocalizedDocEntries, normalizeLocale } from "@/lib/docs/content";

export const dynamic = "force-dynamic";

const categorySummaryByLocale: Record<"en" | "bn", Record<string, string>> = {
  en: {
    "Start Here": "Begin from installation and developer flow, then move into feature development.",
    "Product Blueprint":
      "Understand boundaries, ownership, and architecture decisions before deep edits.",
    "Operations & Release": "Keep CI, deployment, and release automation stable and predictable.",
    "Security & Access": "Read all auth and security controls end-to-end before production use.",
    "Maintainer Playbook":
      "Maintenance routines, governance checklist, and team-level repository operations.",
    "Maintenance & Migration":
      "Policy and tooling migrations with low-risk steps and verification checks."
  },
  bn: {
    "শুরু করুন": "ইনস্টলেশন ও ডেভেলপার ফ্লো থেকে শুরু করে ধাপে ধাপে ফিচার ডেভেলপমেন্টে যান।",
    "প্রোডাক্ট ব্লুপ্রিন্ট":
      "ডিপ এডিটের আগে ownership, boundary, এবং architecture decision পরিষ্কারভাবে বুঝুন।",
    "অপারেশনস ও রিলিজ":
      "CI, deployment, এবং release automation যেন সবসময় স্থির ও নির্ভরযোগ্য থাকে।",
    "সিকিউরিটি ও অ্যাকসেস": "প্রোডাকশনের আগে auth ও security control গুলো end-to-end পড়ে নিন।",
    "মেইনটেইনার প্লেবুক":
      "রুটিন মেইনটেনেন্স, governance checklist, এবং team-level operational guide।",
    "মেইনটেনেন্স ও মাইগ্রেশন":
      "পলিসি বা টুলিং পরিবর্তনের জন্য নিরাপদ migration step ও verification checklist।"
  }
};

export default async function DocsPage() {
  const locale = normalizeLocale(await getLocale());
  const docs = getLocalizedDocEntries(locale);
  const categories = Object.entries(
    docs.reduce<Record<string, typeof docs>>((acc, entry) => {
      if (!acc[entry.category]) {
        acc[entry.category] = [];
      }
      acc[entry.category].push(entry);
      return acc;
    }, {})
  );
  return (
    <main className="landing-shell docs-shared-gradient min-h-screen overflow-x-clip">
      <Navbar />

      <section className="relative min-h-[calc(100vh-64px)] overflow-y-auto px-4 pt-4 pb-12 sm:px-6 sm:pt-5 lg:px-8">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center">
          <div className="w-full max-w-[920px] text-center">
            <p className="text-xs font-semibold tracking-[0.24em] text-emerald-300 uppercase">
              {locale === "bn" ? "ডকস জার্নাল" : "Docs Journal"}
            </p>
            <h1 className="mt-3 text-[2rem] font-semibold tracking-[-0.03em] text-[var(--landing-text-strong)] sm:text-[2.7rem]">
              {locale === "bn" ? "বয়লারপ্লেট ডকস, ব্লগ স্টাইলে" : "Boilerplate Docs, Blog Style"}
            </h1>
            <p className="mt-3 text-[0.98rem] leading-[1.7] text-[var(--landing-muted)]">
              {locale === "bn"
                ? "সব গাইড long-form reading experience হিসেবে সাজানো। category expand করে article খুলুন, আর raw markdown দরকার হলে GitHub source link ব্যবহার করুন।"
                : "Every guide is organized like a long-form reading experience. Expand a category, open the article page, and use the GitHub source link whenever you need raw markdown."}
            </p>
          </div>

          <div className="mt-8 w-full max-w-[920px] space-y-4">
            {categories.map(([category, items]) => (
              <details
                key={category}
                className="docs-hub-category group overflow-hidden rounded-[22px] border border-[var(--landing-border)] shadow-[0_14px_45px_rgba(15,23,42,0.14)]"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 px-5 py-4 sm:px-6">
                  <div>
                    <h2 className="text-[1.05rem] font-semibold text-[var(--landing-text-strong)]">
                      {category}
                    </h2>
                    <p className="mt-1 text-sm leading-[1.55] text-[var(--landing-soft)]">
                      {categorySummaryByLocale[locale][category]}
                    </p>
                  </div>
                  <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--landing-border)] text-[var(--landing-muted)] transition group-open:rotate-90">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </summary>

                <div className="space-y-3 border-t border-[var(--landing-border)] px-5 py-4 sm:px-6">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="docs-hub-item rounded-2xl border border-[var(--landing-border)] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-semibold text-[var(--landing-text-strong)]">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-sm leading-[1.55] text-[var(--landing-soft)]">
                            {item.description}
                          </p>
                        </div>
                        <BookOpenText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--landing-muted)]">
                          <Clock3 className="h-3.5 w-3.5" />
                          {item.readTime}
                        </span>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/docs/${item.slug.join("/")}`}
                            className="docs-hub-open-btn inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-medium text-[var(--landing-text-strong)] transition duration-200"
                          >
                            {locale === "bn" ? "আর্টিকেল খুলুন" : "Open Article"}
                          </Link>
                          <a
                            href={getGithubHref(item.sourcePath)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-xl border border-[var(--landing-border)] px-3 py-1.5 text-xs font-medium text-[var(--landing-text-strong)] transition duration-200 hover:bg-white/[0.04]"
                          >
                            {locale === "bn" ? "GitHub" : "GitHub"}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 flex w-full max-w-[920px] flex-wrap items-center justify-center gap-3">
            <Link
              href="/features"
              className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#8b3dff_0%,#d946ef_48%,#fb7185_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_38px_rgba(217,70,239,0.32)] transition duration-200 hover:-translate-y-0.5"
            >
              {locale === "bn" ? "ফিচারস দেখুন" : "Explore Features"}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
