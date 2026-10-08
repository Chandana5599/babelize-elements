import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // /r/* is the shadcn registry JSON consumed by the CLI, not pages to index.
    rules: { userAgent: "*", allow: "/", disallow: "/r/" },
    sitemap: "https://elements.babelize.co/sitemap.xml",
  };
}
