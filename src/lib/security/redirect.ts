export function getSafeRedirectPath(
  input: string | null | undefined,
  fallback = "/dashboard"
): string {
  if (!input) {
    return fallback;
  }

  try {
    const baseUrl = new URL("http://localhost");
    const resolved = new URL(input, baseUrl);

    if (resolved.origin !== baseUrl.origin) {
      return fallback;
    }

    if (!resolved.pathname.startsWith("/")) {
      return fallback;
    }

    if (resolved.pathname.startsWith("//")) {
      return fallback;
    }

    if (resolved.pathname.includes("\\")) {
      return fallback;
    }

    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return fallback;
  }
}
