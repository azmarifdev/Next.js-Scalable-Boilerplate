import { Code2, Rocket, ShieldCheck, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";

const featureIcons = [Rocket, ShieldCheck, Zap, Code2];

export async function Features() {
  const t = await getTranslations("home");
  const features = t.raw("features") as Array<{ title: string; description: string }>;

  return (
    <section id="features" className="relative px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1520px]">
        <div className="rounded-[28px] bg-[linear-gradient(180deg,var(--landing-panel-start),var(--landing-panel-end))] px-5 py-6 shadow-[0_20px_90px_rgba(8,5,24,0.12)] backdrop-blur-xl sm:px-7 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = featureIcons[index];

              return (
                <article
                  key={feature.title}
                  className="flex items-start gap-4 rounded-[22px] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] px-5 py-5 transition duration-200 hover:bg-white/[0.04]"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-[image:var(--landing-icon-surface)] shadow-[0_0_32px_rgba(129,44,248,0.18)]">
                    <Icon className="h-7 w-7 text-fuchsia-300" strokeWidth={1.9} />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-[1rem] font-semibold tracking-[-0.03em] text-[var(--landing-text-strong)]">
                      {feature.title}
                    </h3>
                    <p className="mt-2.5 max-w-[230px] text-[0.95rem] leading-[1.5] text-[var(--landing-soft)]">
                      {feature.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div id="examples" className="sr-only" />
      <div id="pricing" className="sr-only" />
    </section>
  );
}
