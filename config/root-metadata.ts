type Metadata = Record<string, unknown>;

import { siteConfig } from "../src/lib/config/site-config";

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "Next.js-Boilerplate-PostgresQL-Drizzle",
    "Dashboard"
  ],
  authors: [{ name: "Next.js-Boilerplate-PostgresQL-Drizzle Maintainer" }],
  creator: "Next.js-Boilerplate-PostgresQL-Drizzle Maintainer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};
