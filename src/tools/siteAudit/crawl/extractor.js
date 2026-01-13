import cheerio from "cheerio";

export function extractLinks(html, baseUrl) {
  if (!html) return [];

  const $ = cheerio.load(html);
  const links = new Set();

  $("a[href]").each((_, el) => {
    try {
      const href = $(el).attr("href");
      const url = new URL(href, baseUrl);

      if (url.origin === new URL(baseUrl).origin) {
        url.hash = "";
        links.add(url.toString());
      }
    } catch {}
  });

  return [...links];
}
