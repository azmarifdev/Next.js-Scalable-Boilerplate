# ওয়ার্কফ্লো

## উদ্দেশ্য

এই boilerplate-এ থাকা 13টি GitHub Actions workflow কী করে এবং কখন run হয় তা এখানে দেওয়া আছে।

---

## CI & Quality

### `ci.yml`

Trigger:

- PR (`pull_request`)
- `main/master/develop` push (path-filtered)

Checks:

- `Quality (lint)`
- `Quality (typecheck)`
- `Quality (test)`
- `Build`

নোট:

- PR trigger থেকে path filter সরানো হয়েছে যাতে required checks `Expected` এ আটকে না থাকে।

### `package-manager-consistency.yml`

- lockfile/package manager consistency validate করে।

### `bun-compatibility.yml`

- Bun compatibility check।

---

## PR Governance

- `commitlint.yml` -> `commitlint`
- `pr-title.yml` -> `semantic-pr-title`
- `labeler.yml` -> auto labels
- `pr-auto-merge.yml` -> optional auto-merge

---

## Security & Dependency

- `codeql.yml` -> `Analyze (JavaScript/TypeScript)`
- `codehawk.yml` -> `scan`
- `dependency-review.yml` -> `dependency-review`
- `dependabot-auto-merge.yml` -> safe dependabot merge

---

## Release & Maintenance

### `release-please.yml`

কাজ:

1. release PR create/update
2. release PR merge হলে tag/release create
3. release PR expected-deadlock avoid করার hardening steps

### `stale.yml`

- stale issue/PR manage করে

---

## Recommended Required Checks

- `Build`
- `Quality (lint)`
- `Quality (test)`
- `Quality (typecheck)`
- `commitlint`
- `dependency-review`
- `semantic-pr-title`
- `scan`
- `Analyze (JavaScript/TypeScript)`

---

## Troubleshooting

### `Expected` stuck

1. ruleset required checks remove করুন
2. successful PR থেকে dropdown দিয়ে re-add করুন
3. workflow rerun/push tiny commit

### Release PR checks expected

1. Release Please logs দেখুন
2. synthetic check mark message না থাকলে rerun
3. message থাকলে ruleset mapping reset

---

## Related

- `docs/guides/github-setup-checklist.md`
- `docs/guides/release-automation.md`
