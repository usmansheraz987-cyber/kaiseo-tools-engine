import { fetchPageHtml } from "../../../lib/fetcher/fetchPage.js";
import { extractLinks } from "./extractor.js";
import { loadSitemapUrls } from "./sitemap.js";
import { LIMITS } from "./limits.js";
import { normalizeUrl } from "../utils/normalizeUrl.js";

export async function createCrawlQueue({
  baseUrl,
  sitemapUrl,
  maxPages,
  robotsRules,
  startTime
}) {
  const visited = new Set();
  const queued = new Set();
  const pages = [];
  const queue = [];

  let maxDepth = 0;
  let hitLimit = false;

  const enqueue = (url, depth) => {
    const normalized = normalizeUrl(url);
    if (!normalized) return;
    if (visited.has(normalized)) return;
    if (queued.has(normalized)) return;
    if (depth > LIMITS.MAX_DEPTH) return;

    queued.add(normalized);
    queue.push({ url: normalized, depth });
  };

  // 1️⃣ Seed homepage
  enqueue(baseUrl, 0);

  // 2️⃣ Seed sitemap
  if (sitemapUrl) {
    try {
      const sitemapUrls = await loadSitemapUrls(sitemapUrl);
      for (const url of sitemapUrls) {
        enqueue(url, 1);
      }
    } catch {
      // ignore sitemap failure
    }
  }

  // 3️⃣ Crawl loop (Screaming Frog style)
  while (queue.length && pages.length < maxPages) {
    if (Date.now() - startTime > LIMITS.MAX_TOTAL_TIME_MS) {
      hitLimit = true;
      break;
    }

    const { url, depth } = queue.shift();
    queued.delete(url);

    if (visited.has(url)) continue;
    if (!robotsRules.isAllowed(url, "*")) continue;

    visited.add(url);
    maxDepth = Math.max(maxDepth, depth);

    let html = "";
    let status = 0;
    let finalUrl = url;

    try {
      const response = await fetchPageHtml(url);
      html = response.html;
      status = response.meta.httpStatus;
      finalUrl = response.meta.finalUrl;
    } catch (err) {
      status = 0; // fetch failed, still record page
    }

    const page = {
      url,
      finalUrl,
      status,
      depth,
      html
    };

    pages.push(page);

    // 4️⃣ Extract links only from valid HTML
    if (html && depth < LIMITS.MAX_DEPTH && pages.length < maxPages) {
      const links = extractLinks(html, baseUrl);
      for (const link of links) {
        enqueue(link, depth + 1);
      }
    }
  }

  if (pages.length >= maxPages) {
    hitLimit = true;
  }

  return {
    pages,
    maxDepth,
    hitLimit
  };
}
