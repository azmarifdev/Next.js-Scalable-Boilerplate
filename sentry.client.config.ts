import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const tracesSampleRate = Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0.05");

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: Number.isFinite(tracesSampleRate) ? tracesSampleRate : 0.05
  });
}
