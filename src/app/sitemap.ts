import { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/login", "/register", "/dashboard", "/users", "/projects", "/tasks"];
  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date()
  }));
}
