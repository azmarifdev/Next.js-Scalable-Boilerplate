import { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/login",
    "/register",
    "/docs",
    "/docs/readme",
    "/docs/how-to-use",
    "/docs/guides/adopting-boilerplate",
    "/docs/guides/database-setup",
    "/docs/guides/production-services",
    "/docs/guides/auth-setup-and-migration",
    "/docs/architecture",
    "/docs/auth-flow",
    "/docs/folder-structure",
    "/docs/workflows",
    "/docs/guides",
    "/docs/guides/release-automation",
    "/docs/guides/deployment",
    "/docs/deployment/cloud-providers",
    "/docs/security",
    "/docs/guides/github-setup-checklist",
    "/docs/guides/project-maintenance",
    "/docs/contributing",
    "/docs/migrations/package-manager",
    "/features"
  ];
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date()
  }));
}
