# GitHub সেটআপ চেকলিস্ট

## উদ্দেশ্য

এই boilerplate repo production-ready করার জন্য GitHub setup hardening checklist।

---

## দ্রুত সেটআপ ক্রম

1. `main` branch ruleset configure করুন
2. exact required checks যোগ করুন
3. Actions permissions সেট করুন
4. repository secrets যোগ করুন
5. merge strategy ঠিক করুন
6. test PR দিয়ে validation করুন

---

## 1) Branch Ruleset (`main`)

পথ:
`Settings` -> `Rules` -> `Rulesets` -> `New branch ruleset`

সাজেশন:

- নাম: `Protect main`
- Enforcement: `Active`
- Target branch: `main`
- Bypass list: empty (recommended)

Enable করুন:

- `Require a pull request before merging`
- `Require approvals` (minimum `1`)
- `Dismiss stale approvals`
- `Require status checks to pass`
- `Block force pushes`
- `Restrict deletions`

---

## 2) Required Checks (Exact নাম)

**Add checks** dropdown থেকে এই check-run names যোগ করুন:

- `Build`
- `Quality (lint)`
- `Quality (test)`
- `Quality (typecheck)`
- `commitlint`
- `dependency-review`
- `semantic-pr-title`
- `scan`
- `Analyze (JavaScript/TypeScript)`

গুরুত্বপূর্ণ:

- workflow name না, job check নাম required দিন
- যেমন `CI` required দিলে mismatch হতে পারে

Non-required রাখুন:

- `Release Please`
- `PR Labeler`
- `PR Auto Merge`
- `Dependabot Auto Merge`
- `Stale Issues and PRs`
- `Pnpm Compatibility`

---

## 3) GitHub Actions Permissions

পথ:
`Settings` -> `Actions` -> `General`

Set করুন:

- `Workflow permissions`: `Read and write permissions`
- `Allow GitHub Actions to create and approve pull requests`: enabled

---

## 4) Repository Secrets

পথ:
`Settings` -> `Secrets and variables` -> `Actions`

ন্যূনতম:

- `DATABASE_URL`
- `AUTH_SESSION_SECRET`

Optional:

- `AUTH_MFA_VERIFY_URL`
- `AUTH_MFA_VERIFY_BEARER_TOKEN`
- `NEXT_PUBLIC_CUSTOM_AUTH_BASE_URL`
- `RELEASE_PLEASE_TOKEN` (optional)

---

## 5) Merge Strategy

পথ:
`Settings` -> `General` -> `Pull Requests`

Recommended:

- squash merge: on
- merge commit: off
- rebase merge: optional

---

## 6) Test PR Validation

একটা ছোট docs PR খুলে title দিন:

`chore(docs): validate github setup`

তারপর verify করুন required checks run হচ্ছে কিনা।

---

## 7) সাধারণ সমস্যা ও সমাধান

### Problem: `Expected — Waiting for status to be reported`

কারণ:

- ruleset check name mismatch
- stale required checks
- trigger skip

সমাধান:

1. ruleset থেকে required checks remove করুন
2. successful PR থেকে **Add checks** দিয়ে আবার add করুন
3. tiny commit push বা workflow rerun দিন

### Problem: Release PR-এ সব checks `Expected`

সমাধান:

1. `Release Please` run logs দেখুন
2. `Marked ... required checks as success ...` message আছে কিনা দেখুন
3. message থাকলে ruleset mapping reset করুন (remove + re-add)
4. message না থাকলে workflow rerun দিন

---

## Related

- [Workflows](../workflows.md)
- [Release Automation](release-automation.md)
