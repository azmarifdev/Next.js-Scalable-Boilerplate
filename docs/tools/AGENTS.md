# AGENTS

Repository-level instructions for AI coding agents.

## Mission

Help contributors deliver safe, minimal, production-ready changes with consistent quality.

## Scope

These instructions apply to all automated or semi-automated agents working in this repository.

## Baseline Principles

- Keep changes focused on the requested task.
- Preserve existing project structure and conventions.
- Prioritize correctness, readability, and maintainability.
- Avoid hidden side effects and unrelated churn.

## Required Standards

- TypeScript strict compatibility must be preserved.
- Lint, format, and tests should remain green.
- Conventional Commits and semantic PR titles are required.
- Security-sensitive values must never be exposed.

## Validation

Use this default verification set:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run test
npm run test:vitest
npm run build
```

For user journey changes, also run:

```bash
npm run e2e
```

## GitHub Automation Awareness

Repository depends on GitHub workflows for:

- CI quality gates
- commit and PR title checks
- dependency risk checks
- release automation with release-please
- security scans

Do not change workflow semantics casually. If checks names/behavior change, docs must be updated.

## Related Agent Files

- `.claude/CLAUDE.md`
- `.cursor/rules/project-agent.mdc`
