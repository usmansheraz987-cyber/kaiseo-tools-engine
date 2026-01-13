import { fetchPage } from "../../lib/fetcher/fetchPage.js";
import cheerio from "cheerio";

export async function loadSitemapUrls(sitemapUrl) {
  try {
    const res = await fetchPage(sitemapUrl);
    const $ = cheerio.load(res.body, { xmlMode: true });

    const urls = [];
    $("url > loc").each((_, el) => {
      urls.push($(el).text().trim());
    });

    return urls;
  } catch {
    return [];
  }
}
