import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://graze-lounge.com"; // change later

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/menu`, lastModified: new Date() },
    { url: `${baseUrl}/gallery`, lastModified: new Date() },
  ];
}