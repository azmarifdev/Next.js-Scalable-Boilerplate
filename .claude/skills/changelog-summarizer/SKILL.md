---
name: changelog-summarizer
description: Automatically compiles highly polished, user-facing changelogs and weekly product updates from git commit history. Use this skill when generating release notes, summarizing commits for weekly updates, or updating the documentation hub with product release posts.
---

# Changelog Summarizer & Release Notes Generator

This skill processes technical git commits into clean, consumer-friendly weekly summaries or release notes. It filters out internal development noise and categorizes meaningful changes for SaaS customers, matching the format required for the project's Documentation Hub (`src/app/docs/` or `docs/`).

## 📋 What This Skill Does

1. **Scans Git History**: Automatically reads git commits since the last version tag or between specific dates.
2. **Filters Noise**: Excludes internal refactors, testing additions, dependency upgrades (`chore`, `build`, `ci`, `test`) unless they represent significant, customer-facing upgrades.
3. **Categorizes & Translates**: Converts technical developer language into business value:
   - `feat` → ✨ New Features
   - `fix` → 🐛 Bug Fixes
   - `perf` → ⚡ Improvements & Performance
4. **Formats Professionally**: Structures updates with clear markdown headings, bold accents, and bullet lists ready to be published.

---

## 🏃 Running Commands & Scans

To summarize commit logs, run git log commands, parse the output, and compile:

```bash
# View commits since a specific tag
git log v0.1.0..HEAD --oneline

# View commits for the past 7 days
git log --since="7 days ago" --oneline
```

---

## ✍️ Formatting Guidelines & Translation Pattern

When translating commits into user-facing release notes, adhere to this structure:

### ❌ Technical Developer Commit (Internal)

`fix(auth): resolve memory leak in session audit logger and adjust lockup IP parsing`

### ✅ User-Facing Translation (Customer Friendly)

- **Security & Session Hardening**: Resolved a session tracking memory issue, ensuring smoother login audit security and improved tracking accuracy for suspicious IPs.

---

## 📄 Output Template

Compile the generated summary in standard markdown matching the documentation templates:

```markdown
# What's New — [Date / Version]

A summary of updates, features, and fixes deployed this week.

## ✨ New Features

- **[Feature Name in Bold]**: A brief, benefit-first explanation of the feature. Focus on the value to the user rather than the database/code mechanics.

## 🔧 Improvements & Performance

- **[Improvement Area]**: Details on speed upgrades, refactored UX interactions, or responsive visual enhancements.

## 🐛 Bug Fixes

- **[Fix Area]**: Explanation of the issue resolved, reassuring users that standard operations are fully operational.
```
