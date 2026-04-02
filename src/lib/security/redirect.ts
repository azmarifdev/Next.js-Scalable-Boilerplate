export function getSafeRedirectPath(
  input: string | null | undefined,
  fallback = "/dashboard"
): string {
  if (!input) {
    return fallback;
  }

  if (!input.startsWith("/")) {
    return fallback;
  }

  if (input.startsWith("//")) {
    return fallback;
  }

  return input;
}
