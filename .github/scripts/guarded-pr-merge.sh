#!/usr/bin/env bash
set -euo pipefail
set -x

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <pr-url> [skip-review-gate]" >&2
  exit 2
fi

pr_url="$1"
skip_review_gate="${2:-false}"
repo="${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
max_wait_seconds=120
poll_interval_seconds=5

if [[ -z "${GH_TOKEN:-}" && -z "${GITHUB_TOKEN:-}" ]]; then
  echo "GH_TOKEN or GITHUB_TOKEN is required for gh CLI authentication." >&2
  exit 2
fi

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is not installed on this runner." >&2
  exit 2
fi

echo "Guarded merge context: repo=${repo}, pr_url=${pr_url}, skip_review_gate=${skip_review_gate}"

# Try native auto-merge first. If policy rejects it, fall back to guarded direct merge checks.
set +e
auto_merge_output="$(gh pr merge --auto --squash "$pr_url" 2>&1)"
auto_merge_status=$?
set -e

if [[ $auto_merge_status -eq 0 ]]; then
  echo "$auto_merge_output"
  exit 0
fi

echo "$auto_merge_output"
if ! grep -Eq "enablePullRequestAutoMerge|Protected branch rules not configured|Auto-merge is not enabled|not enabled for this repository" <<<"$auto_merge_output"; then
  exit $auto_merge_status
fi

echo "Auto-merge is unavailable for ${repo}. Applying guarded direct merge strategy."

is_draft="$(gh pr view "$pr_url" --repo "$repo" --json isDraft --jq '.isDraft')"
if [[ "$is_draft" == "true" ]]; then
  echo "PR is still draft. Skipping merge attempt."
  exit 0
fi

if [[ "$skip_review_gate" != "true" ]]; then
  review_decision="$(gh pr view "$pr_url" --repo "$repo" --json reviewDecision --jq '.reviewDecision // ""')"
  if [[ "$review_decision" == "REVIEW_REQUIRED" ]]; then
    echo "Review is required before merge. Skipping merge attempt."
    exit 0
  fi
fi

elapsed=0
while :; do
  mergeable="$(gh pr view "$pr_url" --repo "$repo" --json mergeable --jq '.mergeable // ""')"
  merge_state_status="$(gh pr view "$pr_url" --repo "$repo" --json mergeStateStatus --jq '.mergeStateStatus // ""')"

  if [[ "$mergeable" != "UNKNOWN" && "$merge_state_status" != "UNKNOWN" ]]; then
    break
  fi

  if (( elapsed >= max_wait_seconds )); then
    echo "PR mergeability is still unknown after ${max_wait_seconds}s. Failing to avoid unsafe merge."
    exit 1
  fi

  sleep "$poll_interval_seconds"
  elapsed=$((elapsed + poll_interval_seconds))
done

if [[ "$mergeable" == "CONFLICTING" ]]; then
  echo "PR has merge conflicts. Skipping merge attempt."
  exit 0
fi

case "$merge_state_status" in
  CLEAN|HAS_HOOK|UNSTABLE)
    ;;
  BLOCKED|BEHIND|DIRTY|DRAFT)
    echo "PR merge state is ${merge_state_status}. Skipping merge attempt."
    exit 0
    ;;
  *)
    echo "Unexpected merge state status '${merge_state_status}'. Failing for visibility."
    exit 1
    ;;
esac

# Block until required checks settle. Fails if any required check fails.
gh pr checks "$pr_url" --repo "$repo" --required --watch --interval 10

# Prevent race conditions: only merge if head commit is unchanged.
head_sha="$(gh pr view "$pr_url" --repo "$repo" --json headRefOid --jq '.headRefOid')"
gh pr merge --squash --match-head-commit "$head_sha" "$pr_url"
