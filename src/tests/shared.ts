/**
 * Shared test utilities.
 *
 * Use these helpers in integration tests that create mock `NextRequest` /
 * `Request` objects so the origin stays consistent with the centralized
 * origin config.
 */

import { getLocalAppOrigin } from "@/lib/config/url";

/** Local origin derived from APP_PROTOCOL / APP_HOST / PORT defaults. */
export const TEST_LOCAL_ORIGIN = getLocalAppOrigin();

/** Build a mock request URL rooted at the test local origin. */
export function testUrl(path: string): string {
  return `${TEST_LOCAL_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}
