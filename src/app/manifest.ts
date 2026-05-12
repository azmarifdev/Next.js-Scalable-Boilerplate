import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/config/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Next.js BP",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#090614",
    theme_color: "#090614",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml"
      }
    ]
  };
}
