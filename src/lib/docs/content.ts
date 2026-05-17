import { readFile } from "node:fs/promises";
import path from "node:path";

export type SupportedLocale = "en" | "bn";

interface LocalizedText {
  en: string;
  bn: string;
}

export interface DocEntry {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  category: LocalizedText;
  readTime: LocalizedText;
  sourcePath: {
    en: string;
    bn: string;
  };
  slug: string[];
}

export interface LocalizedDocEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  sourcePath: string;
  slug: string[];
}

export const repoBase =
  "https://github.com/azmarifdev/Next.js-Boilerplate-PostgresQL-Drizzle/blob/main";

export const docEntries: DocEntry[] = [
  {
    id: "readme",
    title: { en: "Project README", bn: "প্রজেক্ট README" },
    description: {
      en: "Fastest path to run, configure, and ship the template safely.",
      bn: "টেমপ্লেট নিরাপদভাবে চালানো, কনফিগার করা এবং শিপ করার সবচেয়ে ছোট পথ।"
    },
    category: { en: "Start Here", bn: "শুরু করুন" },
    readTime: { en: "6 min read", bn: "৬ মিনিট পড়া" },
    sourcePath: { en: "README.md", bn: "README.md" },
    slug: ["readme"]
  },
  {
    id: "how-to-use",
    title: { en: "How to Use", bn: "কীভাবে ব্যবহার করবেন" },
    description: {
      en: "Install, configure env, switch auth modes, and run daily workflows.",
      bn: "ইনস্টল, env কনফিগ, auth mode পরিবর্তন এবং দৈনন্দিন workflow চালানোর গাইড।"
    },
    category: { en: "Start Here", bn: "শুরু করুন" },
    readTime: { en: "6 min read", bn: "৬ মিনিট পড়া" },
    sourcePath: { en: "docs/how-to-use.md", bn: "docs/how-to-use.md" },
    slug: ["how-to-use"]
  },
  {
    id: "adopting-boilerplate",
    title: { en: "Adopting This Boilerplate", bn: "বয়লারপ্লেট অ্যাডপশন" },
    description: {
      en: "What to rename, configure, replace, remove, and verify for a real product.",
      bn: "রিয়েল প্রোডাক্টের জন্য কী rename, configure, replace, remove এবং verify করবেন।"
    },
    category: { en: "Start Here", bn: "শুরু করুন" },
    readTime: { en: "10 min read", bn: "১০ মিনিট পড়া" },
    sourcePath: {
      en: "docs/guides/adopting-boilerplate.md",
      bn: "docs/guides/adopting-boilerplate.md"
    },
    slug: ["guides", "adopting-boilerplate"]
  },
  {
    id: "architecture",
    title: { en: "Architecture", bn: "আর্কিটেকচার" },
    description: {
      en: "Understand app layers, request path, auth model, and system boundaries.",
      bn: "অ্যাপ লেয়ার, রিকোয়েস্ট পাথ, auth মডেল, এবং সিস্টেম বাউন্ডারি বুঝুন।"
    },
    category: { en: "Product Blueprint", bn: "প্রোডাক্ট ব্লুপ্রিন্ট" },
    readTime: { en: "7 min read", bn: "৭ মিনিট পড়া" },
    sourcePath: { en: "docs/architecture.md", bn: "docs/architecture.md" },
    slug: ["architecture"]
  },
  {
    id: "folder-structure",
    title: { en: "Folder Structure", bn: "ফোল্ডার স্ট্রাকচার" },
    description: {
      en: "Ownership map for app, modules, infra, providers, and tests.",
      bn: "app, module, infra, provider এবং test ফোল্ডারের ownership map।"
    },
    category: { en: "Product Blueprint", bn: "প্রোডাক্ট ব্লুপ্রিন্ট" },
    readTime: { en: "5 min read", bn: "৫ মিনিট পড়া" },
    sourcePath: { en: "docs/folder-structure.md", bn: "docs/folder-structure.md" },
    slug: ["folder-structure"]
  },
  {
    id: "workflows",
    title: { en: "Workflows", bn: "ওয়ার্কফ্লো" },
    description: {
      en: "CI, governance, security scanning, and release operations overview.",
      bn: "CI, governance, security scan এবং release operations overview।"
    },
    category: { en: "Operations & Release", bn: "অপারেশনস ও রিলিজ" },
    readTime: { en: "5 min read", bn: "৫ মিনিট পড়া" },
    sourcePath: { en: "docs/workflows.md", bn: "docs/workflows.md" },
    slug: ["workflows"]
  },
  {
    id: "release-automation",
    title: { en: "Release Automation", bn: "রিলিজ অটোমেশন" },
    description: {
      en: "How Release Please handles versioning, changelog, tags, and releases.",
      bn: "Release Please কীভাবে versioning, changelog, tag, release হ্যান্ডেল করে।"
    },
    category: { en: "Operations & Release", bn: "অপারেশনস ও রিলিজ" },
    readTime: { en: "4 min read", bn: "৪ মিনিট পড়া" },
    sourcePath: {
      en: "docs/guides/release-automation.md",
      bn: "docs/guides/release-automation.md"
    },
    slug: ["guides", "release-automation"]
  },
  {
    id: "deployment-guide",
    title: { en: "Deployment Guide", bn: "ডিপ্লয়মেন্ট গাইড" },
    description: {
      en: "Step-by-step deployment runbook with validation and post-deploy checks.",
      bn: "ধাপে ধাপে deployment runbook, validation এবং post-deploy check সহ।"
    },
    category: { en: "Operations & Release", bn: "অপারেশনস ও রিলিজ" },
    readTime: { en: "5 min read", bn: "৫ মিনিট পড়া" },
    sourcePath: { en: "docs/guides/deployment.md", bn: "docs/guides/deployment.md" },
    slug: ["guides", "deployment"]
  },
  {
    id: "database-setup",
    title: { en: "Database Setup", bn: "ডাটাবেস সেটআপ" },
    description: {
      en: "PostgreSQL, Neon, Drizzle migrations, runtime access, and production migration workflow.",
      bn: "PostgreSQL, Neon, Drizzle migration, runtime access এবং production migration workflow।"
    },
    category: { en: "Operations & Release", bn: "অপারেশনস ও রিলিজ" },
    readTime: { en: "5 min read", bn: "৫ মিনিট পড়া" },
    sourcePath: {
      en: "docs/guides/database-setup.md",
      bn: "docs/guides/database-setup.md"
    },
    slug: ["guides", "database-setup"]
  },
  {
    id: "production-services",
    title: { en: "Production Services", bn: "প্রোডাকশন সার্ভিস" },
    description: {
      en: "Configure Sentry, Resend, Upstash Redis, and production migration secrets.",
      bn: "Sentry, Resend, Upstash Redis এবং production migration secret কনফিগার করুন।"
    },
    category: { en: "Operations & Release", bn: "অপারেশনস ও রিলিজ" },
    readTime: { en: "5 min read", bn: "৫ মিনিট পড়া" },
    sourcePath: {
      en: "docs/guides/production-services.md",
      bn: "docs/guides/production-services.md"
    },
    slug: ["guides", "production-services"]
  },
  {
    id: "cloud-providers",
    title: { en: "Cloud Providers", bn: "ক্লাউড প্রোভাইডার" },
    description: {
      en: "Provider-wise environment requirements and deployment checklist.",
      bn: "প্রোভাইডারভিত্তিক environment requirement এবং deployment checklist।"
    },
    category: { en: "Operations & Release", bn: "অপারেশনস ও রিলিজ" },
    readTime: { en: "4 min read", bn: "৪ মিনিট পড়া" },
    sourcePath: {
      en: "docs/deployment/cloud-providers.md",
      bn: "docs/deployment/cloud-providers.md"
    },
    slug: ["deployment", "cloud-providers"]
  },
  {
    id: "auth-flow",
    title: { en: "Auth Flow", bn: "অথ ফ্লো" },
    description: {
      en: "Internal and custom auth paths, session details, MFA, and route guards.",
      bn: "Internal/custom auth path, session details, MFA এবং route guard।"
    },
    category: { en: "Security & Access", bn: "সিকিউরিটি ও অ্যাকসেস" },
    readTime: { en: "7 min read", bn: "৭ মিনিট পড়া" },
    sourcePath: { en: "docs/auth-flow.md", bn: "docs/auth-flow.md" },
    slug: ["auth-flow"]
  },
  {
    id: "security-policy",
    title: { en: "Security Policy", bn: "সিকিউরিটি পলিসি" },
    description: {
      en: "Supported versions, disclosure process, response model, and sensitive scope.",
      bn: "Supported version, disclosure process, response model এবং sensitive scope।"
    },
    category: { en: "Security & Access", bn: "সিকিউরিটি ও অ্যাকসেস" },
    readTime: { en: "3 min read", bn: "৩ মিনিট পড়া" },
    sourcePath: { en: "docs/security.md", bn: "docs/security.md" },
    slug: ["security"]
  },
  {
    id: "github-setup-checklist",
    title: { en: "GitHub Setup Checklist", bn: "GitHub সেটআপ চেকলিস্ট" },
    description: {
      en: "Branch protection, required checks, secrets, labels, and release permissions.",
      bn: "Branch protection, required checks, secrets, labels, release permissions।"
    },
    category: { en: "Maintainer Playbook", bn: "মেইনটেইনার প্লেবুক" },
    readTime: { en: "4 min read", bn: "৪ মিনিট পড়া" },
    sourcePath: {
      en: "docs/guides/github-setup-checklist.md",
      bn: "docs/guides/github-setup-checklist.md"
    },
    slug: ["guides", "github-setup-checklist"]
  },
  {
    id: "project-maintenance",
    title: { en: "Project Maintenance", bn: "প্রজেক্ট মেইনটেনেন্স" },
    description: {
      en: "Operational maintenance cadence plus CI, release, and dependency troubleshooting runbooks.",
      bn: "অপারেশনাল মেইনটেনেন্স cadence সহ CI, release এবং dependency troubleshooting runbook।"
    },
    category: { en: "Maintainer Playbook", bn: "মেইনটেইনার প্লেবুক" },
    readTime: { en: "8 min read", bn: "৮ মিনিট পড়া" },
    sourcePath: {
      en: "docs/guides/project-maintenance.md",
      bn: "docs/guides/project-maintenance.md"
    },
    slug: ["guides", "project-maintenance"]
  },
  {
    id: "auth-setup-migration",
    title: { en: "Auth Setup and Migration", bn: "Auth সেটআপ ও মাইগ্রেশন" },
    description: {
      en: "Configure better-auth for production or migrate to custom-auth.",
      bn: "Production better-auth configure করুন, বা custom-auth-এ migrate করুন।"
    },
    category: { en: "Maintainer Playbook", bn: "মেইনটেইনার প্লেবুক" },
    readTime: { en: "7 min read", bn: "৭ মিনিট পড়া" },
    sourcePath: {
      en: "docs/guides/auth-setup-and-migration.md",
      bn: "docs/guides/auth-setup-and-migration.md"
    },
    slug: ["guides", "auth-setup-and-migration"]
  },
  {
    id: "guides-index",
    title: { en: "Guides Index", bn: "গাইডস ইনডেক্স" },
    description: {
      en: "Entry point for operational playbooks and recommended reading order.",
      bn: "Operational playbook এবং suggested reading order-এর এন্ট্রি পয়েন্ট।"
    },
    category: { en: "Maintainer Playbook", bn: "মেইনটেইনার প্লেবুক" },
    readTime: { en: "2 min read", bn: "২ মিনিট পড়া" },
    sourcePath: { en: "docs/guides/README.md", bn: "docs/guides/README.md" },
    slug: ["guides"]
  },
  {
    id: "contributing",
    title: { en: "Contributing Guide", bn: "কনট্রিবিউটিং গাইড" },
    description: {
      en: "Contributor workflow, commit standards, testing expectations, and PR quality rules.",
      bn: "Contributor workflow, commit standard, testing expectation এবং PR quality rules।"
    },
    category: { en: "Maintainer Playbook", bn: "মেইনটেইনার প্লেবুক" },
    readTime: { en: "4 min read", bn: "৪ মিনিট পড়া" },
    sourcePath: { en: "docs/guides/contributing.md", bn: "docs/guides/contributing.md" },
    slug: ["contributing"]
  },
  {
    id: "package-manager-migration",
    title: { en: "Package Manager Migration", bn: "প্যাকেজ ম্যানেজার মাইগ্রেশন" },
    description: {
      en: "Safe migration flow for package manager policy changes.",
      bn: "Package manager policy পরিবর্তনের নিরাপদ migration flow।"
    },
    category: { en: "Maintenance & Migration", bn: "মেইনটেনেন্স ও মাইগ্রেশন" },
    readTime: { en: "3 min read", bn: "৩ মিনিট পড়া" },
    sourcePath: {
      en: "docs/migrations/package-manager.md",
      bn: "docs/migrations/package-manager.md"
    },
    slug: ["migrations", "package-manager"]
  }
];

export function normalizeLocale(locale?: string): SupportedLocale {
  return locale === "bn" ? "bn" : "en";
}

export function getLocalizedDocEntries(locale?: string): LocalizedDocEntry[] {
  const normalizedLocale = normalizeLocale(locale);
  return docEntries.map((entry) => ({
    id: entry.id,
    title: entry.title[normalizedLocale],
    description: entry.description[normalizedLocale],
    category: entry.category[normalizedLocale],
    readTime: entry.readTime[normalizedLocale],
    sourcePath: entry.sourcePath[normalizedLocale],
    slug: entry.slug
  }));
}

export function getDocBySlug(slug: string[]): DocEntry | undefined {
  return docEntries.find((item) => item.slug.join("/") === slug.join("/"));
}

export function getLocalizedDocBySlug(
  slug: string[],
  locale?: string
): LocalizedDocEntry | undefined {
  const normalizedLocale = normalizeLocale(locale);
  const entry = getDocBySlug(slug);

  if (!entry) {
    return undefined;
  }

  return {
    id: entry.id,
    title: entry.title[normalizedLocale],
    description: entry.description[normalizedLocale],
    category: entry.category[normalizedLocale],
    readTime: entry.readTime[normalizedLocale],
    sourcePath: entry.sourcePath[normalizedLocale],
    slug: entry.slug
  };
}

export function getGithubHref(sourcePath: string): string {
  return `${repoBase}/${sourcePath}`;
}

export async function readDocSource(sourcePath: string): Promise<string> {
  const absolutePath = path.join(/*turbopackIgnore: true*/ process.cwd(), sourcePath);
  return readFile(absolutePath, "utf-8");
}
