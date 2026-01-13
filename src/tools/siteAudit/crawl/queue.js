import { fetchPageHtml } from "../../../lib/fetcher/fetchPage.js";
import { extractLinks } from "./extractor.js";
import { loadSitemapUrls } from "./sitemap.js";
import { LIMITS } from "./limits.js";

export async function createCrawlQueue({
  baseUrl,
  sitemapUrl,
  maxPages,
  robotsRules,
  startTime
}) {
  const visited = new Set();
  const pages = [];
  const queue = [];
  let maxDepth = 0;
  let hitLimit = false;

  // Seed homepage
  queue.push({ url: baseUrl, depth: 0 });

  // Seed sitemap URLs
  if (sitemapUrl) {
    const sitemapUrls = await loadSitemapUrls(sitemapUrl);
    for (const url of sitemapUrls) {
      queue.push({ url, depth: 1 });
    }
  }

  while (queue.length && pages.length < maxPages) {
    if (Date.now() - startTime > LIMITS.MAX_TOTAL_TIME_MS) {
      hitLimit = true;
      break;
    }

    const { url, depth } = queue.shift();
    maxDepth = Math.max(maxDepth, depth);

    if (visited.has(url)) continue;
    if (depth > LIMITS.MAX_DEPTH) continue;
    if (!robotsRules.isAllowed(url, "*")) continue;

    visited.add(url);

    let response;
    try {
      response = await fetchPageHtml(url);
    } catch {
      continue;
    }

    const page = {
      url,
      depth,
      html: response.html,
      status: response.meta.httpStatus,
      finalUrl: response.meta.finalUrl
    };

    pages.push(page);

    // Extract internal links
    if (depth < LIMITS.MAX_DEPTH && pages.length < maxPages) {
      const links = extractLinks(page.html, baseUrl);
      for (const link of links) {
        if (!visited.has(link)) {
          queue.push({ url: link, depth: depth + 1 });
        }
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
