/**
 * src/app/api/v1/security/route.ts
 *
 * security.txt endpoint — provides security policy and vulnerability
 * disclosure information for security researchers, as recommended by
 * RFC 9116.
 *
 * Accessible at: /.well-known/security.txt
 */

import { NextResponse } from "next/server";

import { APP_NAME } from "@/lib/config/constants";

export async function GET() {
  const securityTxt = [
    `# Security Policy for ${APP_NAME}`,
    "# https://datatracker.ietf.org/doc/html/rfc9116",
    "",
    "## Contact",
    "To report a security vulnerability, please open a GitHub Security Advisory:",
    "https://github.com/your-repo/security/advisories/new",
    "",
    "## Preferred Languages",
    "en",
    "",
    "## Policy",
    "We follow responsible disclosure. Please do not publicly disclose",
    "vulnerabilities before we have had a chance to address them.",
    "",
    "## Encryption",
    "We do not currently support PGP-encrypted reports. Please use",
    "the GitHub Security Advisory form linked above.",
    "",
    "## Acknowledgments",
    "We thank security researchers who help us keep our users safe.",
    "",
    "## Expires",
    `${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}`
  ].join("\n");

  return new NextResponse(securityTxt, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8"
    }
  });
}
