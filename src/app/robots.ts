import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/admin", "/api/admin"] },
    ],
    sitemap: "https://mdazeezsoftdev.vercel.app/sitemap.xml",
  };
}
