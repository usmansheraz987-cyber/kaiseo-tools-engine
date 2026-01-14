import { normalizeUrl } from "./utils/normalizeUrl.js";
import { loadRobotsRules } from "./utils/robots.js";
import { createCrawlQueue } from "./crawl/queue.js";
import { runChecksOnPage } from "./checks/runChecks.js";
import { buildReport } from "./report/summarize.js";
import { fetchPage } from "../../lib/fetcher/fetchPage.js";

export async function runSiteAudit(input) {
  const startTime = Date.now();

  const baseUrl = normalizeUrl(input.url);
  const maxPages = Math.min(input.maxPages || 50, 100);

  // used for duplicate-content detection
  const contentHashes = new Set();

  // 1. Load robots.txt
  const robotsRules = await loadRobotsRules(baseUrl);

  // 2. ALWAYS fetch and analyze the root page
  let rootPage = null;

  try {
    const rootFetch = await fetchPage(baseUrl);


    rootPage = {
      url: baseUrl,
      html: rootFetch.html,
      status: rootFetch.meta.httpStatus,
      meta: rootFetch.meta
    };
  } catch (err) {
    // even if root fetch fails, continue safely
    rootPage = {
      url: baseUrl,
      html: "",
      status: 500,
      meta: {}
    };
  }

  // 3. Crawl site (controlled)
  const crawlResult = await createCrawlQueue({
    baseUrl,
    sitemapUrl: input.sitemap,
    maxPages: maxPages - 1, // root page already counted
    robotsRules,
    startTime
  });

  // 4. Merge root page + crawled pages
  const pages = rootPage
    ? [rootPage, ...crawlResult.pages]
    : crawlResult.pages;

  // 5. Run checks
  const issues = [];
  for (const page of pages) {
    const pageIssues = runChecksOnPage(
      page,
      pages,
      contentHashes
    );
    issues.push(...pageIssues);
  }

  // 6. Build report
  return buildReport({
    baseUrl,
    pages,
    issues,
    meta: {
      pagesCrawled: pages.length,
      crawlDepth: crawlResult.maxDepth,
      durationMs: Date.now() - startTime,
      hitLimit: crawlResult.hitLimit
    }
  });
}
