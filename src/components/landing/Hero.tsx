import { MoveRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const stackItems = [
  "Next.js 14+",
  "PostgreSQL",
  "Drizzle ORM",
  "TypeScript",
  "Tailwind CSS",
  "Shadcn UI"
];

export async function Hero() {
  const t = await getTranslations("home");

  return (
    <section className="relative overflow-hidden px-4 pt-12 pb-10 sm:px-6 sm:pt-16 sm:pb-14 lg:px-8">
      <div className="absolute inset-0">
        <div className="absolute top-[7%] left-[-4%] h-[500px] w-[220px] rotate-[34deg] bg-[linear-gradient(180deg,rgba(250,232,255,0)_0%,rgba(192,72,255,0.58)_42%,rgba(65,66,255,0)_100%)] blur-[6px]" />
        <div className="absolute top-[36%] left-[10%] h-36 w-36 rounded-full bg-[#4556ff]/30 blur-[82px]" />
        <div className="absolute top-[14%] right-[6%] h-[440px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.2),rgba(129,44,248,0.08)_45%,transparent_72%)] blur-[18px]" />
        <div className="absolute top-[50%] right-[10%] h-24 w-24 rounded-full bg-[#ff4fcf]/55 blur-[26px]" />
        <div className="absolute right-[-1%] bottom-[2%] h-[280px] w-[280px] rotate-[47deg] bg-[linear-gradient(180deg,rgba(255,125,214,0)_0%,rgba(255,83,185,0.68)_50%,rgba(109,40,217,0)_100%)] blur-[8px]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--landing-overlay-top)_0%,var(--landing-overlay-mid)_62%,var(--landing-overlay-bottom)_100%)]" />
        <div className="absolute inset-x-0 top-[8%] bottom-0 [background-image:linear-gradient(var(--landing-grid-y)_1px,transparent_1px),linear-gradient(90deg,var(--landing-grid-x)_1px,transparent_1px)] [background-size:72px_72px] opacity-25" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1040px] flex-col items-center text-center">
        <div className="inline-flex items-center gap-3 rounded-full bg-[var(--landing-surface)] px-4 py-2 text-xs font-medium text-[var(--landing-text)] shadow-[0_12px_45px_rgba(2,6,23,0.18)] backdrop-blur-xl sm:text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]" />
          {t("badge")}
        </div>

        <h1 className="mt-7 max-w-[920px] text-[3rem] leading-[0.96] font-semibold tracking-[-0.055em] text-[var(--landing-text-strong)] sm:text-[4.4rem] lg:text-[5.55rem]">
          <span className="bg-[linear-gradient(135deg,#ff59c7_0%,#d946ef_42%,#8b5cf6_72%,#6d7dff_100%)] bg-clip-text text-transparent">
            Next.js
          </span>{" "}
          {t("heroTitleMiddle")}
          <br />
          PostgreSQL-Drizzle
        </h1>

        <div className="mt-4 h-[3px] w-[240px] rounded-full bg-[linear-gradient(90deg,rgba(255,0,153,0),rgba(234,76,255,0.95),rgba(130,64,255,0))] shadow-[0_0_20px_rgba(217,70,239,0.32)]" />

        <p className="mt-6 max-w-[760px] text-[0.96rem] leading-[1.65] text-[var(--landing-muted)] sm:text-[1.03rem] lg:text-[1.08rem]">
          {t("subtitle")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            className="group inline-flex min-w-[190px] items-center justify-center gap-2.5 rounded-2xl bg-[linear-gradient(135deg,#8b3dff_0%,#d946ef_48%,#fb7185_100%)] px-6 py-3 text-base font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_14px_38px_rgba(217,70,239,0.32)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_46px_rgba(236,72,153,0.4)]"
            href="/register"
          >
            {t("getStarted")}
            <MoveRight className="h-4 w-4 transition duration-200 group-hover:translate-x-1" />
          </Link>

          <a
            className="inline-flex min-w-[200px] items-center justify-center gap-2.5 rounded-2xl bg-[var(--landing-surface)] px-6 py-3 text-base font-semibold text-[var(--landing-text-strong)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md transition duration-200 hover:bg-white/[0.06]"
            href="https://github.com/azmarifdev/next-js-boilerplate-postgresql-drizzle"
            target="_blank"
            rel="noreferrer"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M12 .5C5.65.5.5 5.65.5 12.15c0 5.2 3.35 9.62 7.98 11.17.58.1.8-.25.8-.57 0-.28-.02-1.22-.02-2.2-3.25.72-3.93-1.4-3.93-1.4-.52-1.37-1.3-1.72-1.3-1.72-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.22 1.78 1.22 1.03 1.82 2.73 1.3 3.4.98.1-.78.4-1.3.72-1.6-2.6-.3-5.32-1.33-5.32-5.95 0-1.33.45-2.4 1.2-3.25-.12-.3-.52-1.5.1-3.12 0 0 .98-.32 3.2 1.23a10.9 10.9 0 0 1 5.82 0c2.22-1.55 3.2-1.23 3.2-1.23.62 1.62.22 2.82.1 3.12.75.85 1.2 1.92 1.2 3.25 0 4.63-2.73 5.65-5.35 5.95.43.38.8 1.1.8 2.25 0 1.63-.02 2.95-.02 3.35 0 .32.22.67.8.57 4.63-1.55 7.98-5.98 7.98-11.17C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
            {t("viewOnGitHub")}
          </a>
        </div>

        <div
          id="stack"
          className="mt-8 flex w-full flex-wrap items-center justify-center gap-2.5 lg:gap-3"
        >
          {stackItems.map((item) => (
            <div
              key={item}
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--landing-surface-soft)] px-4 text-sm font-medium text-[var(--landing-text)] shadow-[0_8px_24px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md"
            >
              <span className="mr-2.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/[0.03] text-[9px] text-[var(--landing-soft)]">
                {item.slice(0, 1)}
              </span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
