import { fetchPage } from "../../../lib/fetcher/fetchPage.js";
import cheerio from "cheerio";

export async function loadSitemapUrls(sitemapUrl) {
  try {
    const res = await fetchPage(sitemapUrl);
    if (!res?.body) return [];

    const $ = cheerio.load(res.body, { xmlMode: true });
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
