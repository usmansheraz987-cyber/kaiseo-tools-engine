import { fetchPageHtml } from "../../../lib/fetcher/fetchPage.js";
import * as cheerio from "cheerio";

export async function loadSitemapUrls(sitemapUrl) {
  try {
    const res = await fetchPageHtml(sitemapUrl);
    if (!res.html) return [];

    const $ = cheerio.load(res.html, { xmlMode: true });
    const urls = [];

    $("url > loc").each((_, el) => {
      const loc = $(el).text().trim();
      if (loc) urls.push(loc);
    });

    return urls;
  } catch {
    return [];
  }
}
