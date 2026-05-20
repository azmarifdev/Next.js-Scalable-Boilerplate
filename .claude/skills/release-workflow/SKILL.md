---
name: release-workflow
description: Guide on writing conventional commits, pre-commit validation using Husky/Commitlint, and running release-please workflows for automated changelogs. Use this skill when making commits, preparing releases, verifying semantic commits, or inspecting CHANGELOG.md configurations.
---

# Conventional Commits & Release Automation

This skill governs the git commit discipline and automated release workflow of the Next.js Boilerplate. Adhering to these semantic standards allows the project to automatically determine semantic version bumps (Major, Minor, Patch) and compile user-facing release notes.

## ✍️ Conventional Commits Standard

All commit messages in this repository must follow the Conventional Commits specification. This is strictly enforced locally via `husky` and `commitlint` (defined in `commitlint.config.cjs`).

### Commit Message Format

```
<type>(<optional-scope>): <description>

[optional-body]

[optional-footer(s)]
```

### Supported Commit Types

- **`feat`**: A new feature (triggers a **Minor** version bump, e.g. `feat(auth): add multi-factor authentication step-up`).
- **`fix`**: A bug fix (triggers a **Patch** version bump, e.g. `fix(db): handle transaction lockup in audit logging`).
- **`docs`**: Documentation changes (e.g. `docs(guides): add deployment manual for Railway`).
- **`refactor`**: Code changes that neither fix a bug nor add a feature (e.g. `refactor(utils): extract IP parsing logic`).
- **`perf`**: A code change that improves performance (triggers a **Patch** bump).
- **`test`**: Adding missing tests or correcting existing tests.
- **`ci`**: Changes to CI/CD workflows and scripts.
- **`build`**: Changes that affect the build system or external dependencies (e.g. updating npm packages).
- **`chore`**: Housekeeping tasks that do not modify source or test files (e.g. updating `.gitignore`).

---

## 🚫 Local Guardrails (Husky & Commitlint)

- When you run `git commit`, the pre-commit hook verifies:
  1. File linting & formatting (via `lint-staged` running ESLint and Prettier).
  2. Commit message syntax (via `commitlint`).
- **Ignoring constraints**:
  - Commits starting with `Merge ` (e.g. branch merges) bypass commitlint checks.
  - Commits from Dependabot (`dependabot[bot]`) bypass body max line length checks to prevent long dependency tables from breaking the hooks.

---

## 🔄 Automated Releases (Release Please)

The repository uses Google's **Release Please** to fully automate versions and changelogs.

### How it Works

1. Developers merge pull requests into the `main` branch using standard conventional commit messages.
2. A GitHub Action (`.github/workflows/release-please.yml`) intercepts the merge, scans commit history, and automatically generates/updates a "Release PR".
3. The Release PR contains:
   - Incremented version inside `package.json` and `package-lock.json`/`pnpm-lock.yaml`.
   - Updated `CHANGELOG.md` categorizing all changes since the last tag.
4. **Finalizing the release**: When maintainers merge the Release PR, GitHub Actions automatically:
   - Tags the repository with the new version (e.g., `v1.2.3`).
   - Generates a GitHub Release with the compiled release notes.
