import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/login", "/register", "/dashboard", "/users", "/products", "/orders"];
  return routes.map((route) => ({
    url: `http://localhost:3000${route}`,
    lastModified: new Date()
  }));
}
