# Tech Stack and Tooling

## Core

- Next.js App Router
- React
- TypeScript (strict)
- Tailwind CSS

## App Infrastructure

- NextAuth for auth flow
- Drizzle ORM for data layer
- Zod for validation
- next-intl for i18n

## Quality and Testing

- ESLint + Prettier
- Jest
- Vitest
- Playwright

## Automation

- GitHub Actions for CI checks
- Commitlint and semantic PR title checks
- Dependency review + Dependabot
- CodeQL security scan
- Release Please for version/changelog/release automation

## Common Quality Commands

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run test:vitest
npm run build
```
