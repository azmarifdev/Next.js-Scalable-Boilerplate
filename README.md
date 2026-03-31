# Next Starter Template

Production-ready Next.js App Router starter with TypeScript, feature-based modules, auth flow, services layer, Redux Toolkit store, and modern SaaS tooling.

## Included Stack

- Next.js App Router + React 19 + TypeScript strict mode
- Tailwind CSS 4 + `clsx` + `tailwind-merge` + class sorting via Prettier plugin
- shadcn/ui-ready setup (`components.json`, cva-based UI primitives)
- Auth: custom login/register + NextAuth (GitHub OAuth) + middleware protection
- Stripe payment intent endpoint (real Stripe when key provided, mock fallback)
- Drizzle ORM + Neon driver + Drizzle Kit config/scripts
- Zod + T3 Env for runtime-safe env validation
- i18n scaffold with `next-intl`
- Testing: Jest + RTL, Playwright, Vitest + V8 coverage
- Dev tooling: ESLint, Prettier, Husky, lint-staged, Commitlint, Knip, Storybook
- DevOps: GitHub Actions CI, security headers, health endpoint, instrumentation hooks

## Quick Start

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run preview`
- `npm run analyze`
- `npm run lint`
- `npm run lint:fix`
- `npm run typecheck`
- `npm run format:check`
- `npm run format:write`
- `npm run test`
- `npm run test:watch`
- `npm run test:vitest`
- `npm run test:coverage`
- `npm run e2e`
- `npm run e2e:ui`
- `npm run storybook`
- `npm run build-storybook`
- `npm run db:generate`
- `npm run db:migrate`
- `npm run db:studio`
- `npm run knip`
- `npm run codehawk`

## Team Workflow

- Contribution guide: [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Commit message examples: [`.github-commit-message-examples.txt`](./.github-commit-message-examples.txt)
