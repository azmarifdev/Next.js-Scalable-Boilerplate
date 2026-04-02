# Structure Guide

## Root

- `.github/workflows/`: CI, checks, release automation
- `.claude/`, `.cursor/`, `.windsurf/`, `.kiro/`, `.vscode/`: AI assistant guidance
- `drizzle/`: SQL migrations
- `src/`: application source

## `src/` conventions

- `app/`: routes, layouts, API handlers
- `components/`: reusable UI
- `lib/`: shared utilities and infra helpers
- `store/`: Redux setup
- `i18n/`: localization config
- `styles/`: global styling

## Naming and organization

- Keep feature changes localized.
- Prefer explicit file purpose.
- Reuse existing helper modules before creating new abstractions.
- Avoid broad reorganization unless explicitly required.
