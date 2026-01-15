// src/tools/siteAudit/crawl/sitemap.js

import { XMLParser } from "fast-xml-parser";

export async function fetchSitemapUrls(siteUrl, maxUrls = 500) {
  try {
    const sitemapUrl = new URL("/sitemap.xml", siteUrl).toString();
    const res = await fetch(sitemapUrl, { timeout: 8000 });
    if (!res.ok) return [];

    const xml = await res.text();
    const parser = new XMLParser();
    const data = parser.parse(xml);

    const urls = [];

    const entries = data?.urlset?.url;
    if (!entries) return [];

    const list = Array.isArray(entries) ? entries : [entries];

    for (const entry of list) {
      if (entry.loc) {
        urls.push(entry.loc);
        if (urls.length >= maxUrls) break;
      }
    }

    return urls;
  } catch {
    return [];
  }
}
