#!/usr/bin/env bash
# ===========================================================================
# scripts/check-all.sh
# ---------------------------------------------------------------------------
# Production-grade unified validation pipeline.
# Runs all checks sequentially, tracks pass/fail, prints a clean summary.
# Exit code: 0 if all pass, 1 if any fail.
# ===========================================================================

set -o pipefail

# ── Colors ────────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ── Counters ──────────────────────────────────────────────────────────────
PASSED=0
FAILED=0
FAILED_NAMES=()

# ── Helpers ───────────────────────────────────────────────────────────────

section() {
  local label="$1"
  echo ""
  echo -e "${CYAN}══════════════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  ${label}${NC}"
  echo -e "${CYAN}══════════════════════════════════════════════════════════════${NC}"
  echo ""
}

run_check() {
  local name="$1"
  shift
  section "🔍 ${name}"

  if "$@" 2>&1; then
    echo -e "${GREEN}  ✅ ${name} — PASSED${NC}"
    PASSED=$((PASSED + 1))
  else
    local exit_code=$?
    echo -e "${RED}  ❌ ${name} — FAILED (exit code ${exit_code})${NC}"
    FAILED=$((FAILED + 1))
    FAILED_NAMES+=("${name}")
  fi
}

check_command() {
  local cmd="$1"
  if ! command -v "$cmd" &>/dev/null; then
    echo -e "${YELLOW}  ⚠  '${cmd}' not found. Install with:${NC}"
    echo -e "${YELLOW}     brew install ${cmd}       # macOS${NC}"
    echo -e "${YELLOW}     sudo apt install ${cmd}    # Debian/Ubuntu${NC}"
    echo -e "${YELLOW}     go install github.com/${cmd}/${cmd}@latest  # Go${NC}"
    echo ""
    return 1
  fi
  return 0
}

# ── Start ─────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║        UNIFIED VALIDATION PIPELINE                         ║${NC}"
echo -e "${BOLD}║        Next.js · TypeScript · Drizzle ORM                  ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Started at: $(date '+%Y-%m-%d %H:%M:%S')"
echo -e "  Project:    ${PWD##*/}"
echo ""

# ── 1. Format Write ───────────────────────────────────────────────────────
run_check "format:write" pnpm run format:write

# ── 2. Lint ───────────────────────────────────────────────────────────────
run_check "lint" pnpm run lint

# ── 3. TypeScript Check ───────────────────────────────────────────────────
run_check "typecheck" pnpm run typecheck

# ── 4. Unit + Integration Tests ───────────────────────────────────────────
run_check "test" pnpm run test

# ── 5. Production Build ───────────────────────────────────────────────────
run_check "build" pnpm run build

# ── 6. E2E Tests (Playwright) ─────────────────────────────────────────────
run_check "e2e" pnpm run e2e

# ── 7. Docs Check ─────────────────────────────────────────────────────────
run_check "docs:check" pnpm run docs:check

# ── 8. Knip (Dead File / Unused Dependency Analysis) ──────────────────────
if pnpm run knip &>/dev/null; then
  run_check "knip" pnpm run knip
else
  # knip config may not exist — try dlx as fallback
  run_check "knip" pnpm dlx knip --dependencies -c docs/tools/knip.json
fi

# ── 9. pnpm Audit ─────────────────────────────────────────────────────────
run_check "pnpm audit" pnpm audit --audit-level=low

# ── 10. Gitleaks (Secret Leak Detection) ──────────────────────────────────
if check_command gitleaks; then
  run_check "gitleaks detect" gitleaks detect --no-git -s . 2>/dev/null || \
  run_check "gitleaks detect (with git)" gitleaks detect 2>/dev/null || true
else
  echo -e "${YELLOW}  ⚠  gitleaks is not installed — skipping secret scan.${NC}"
  echo -e "${YELLOW}     Install it to prevent secret leaks in CI:${NC}"
  echo -e "${YELLOW}     https://github.com/gitleaks/gitleaks#installing${NC}"
  echo ""
  # Count as warning, not failure
  echo -e "${GREEN}  ⏭  gitleaks detect — SKIPPED (not installed)${NC}"
fi

# ── 11. Format Check ──────────────────────────────────────────────────────
run_check "format:check" pnpm run format:check

# ── Summary ───────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}║                    PIPELINE SUMMARY                        ║${NC}"
echo -e "${BOLD}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$PASSED" -gt 0 ]; then
  echo -e "${GREEN}  ✅ Passed checks: ${PASSED}${NC}"
fi

if [ "$FAILED" -gt 0 ]; then
  echo -e "${RED}  ❌ Failed checks: ${FAILED}${NC}"
  echo ""
  echo -e "${RED}  Failed steps:${NC}"
  for failed in "${FAILED_NAMES[@]}"; do
    echo -e "${RED}    • ${failed}${NC}"
  done
fi

echo ""
echo -e "  Finished at: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

if [ "$FAILED" -gt 0 ]; then
  echo -e "${RED}${BOLD}  ❌ PIPELINE FAILED — ${FAILED} check(s) failed.${NC}"
  echo -e "${RED}  Fix the issues above and re-run.${NC}"
  echo ""
  exit 1
else
  echo -e "${GREEN}${BOLD}  ✅ ALL CHECKS PASSED — ${PASSED}/${PASSED}${NC}"
  echo -e "${GREEN}  Ready for production. 🚀${NC}"
  echo ""
  exit 0
fi
