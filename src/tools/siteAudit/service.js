import { normalizeUrl } from "./utils/normalizeUrl.js";
import { loadRobotsRules } from "./utils/robots.js";
import { createCrawlQueue } from "./crawl/queue.js";
import { runChecksOnPage } from "./checks/runChecks.js";
import { buildReport } from "./report/summarize.js";

export async function runSiteAudit(input) {
  const startTime = Date.now();

  const baseUrl = normalizeUrl(input.url);
  const maxPages = Math.min(input.maxPages || 50, 100);

  // used for duplicate-content detection
  const contentHashes = new Set();

  // 1. Load robots.txt
  const robotsRules = await loadRobotsRules(baseUrl);

  // 2. Crawl site (controlled)
  const crawlResult = await createCrawlQueue({
    baseUrl,
    sitemapUrl: input.sitemap,
    maxPages,
    robotsRules,
    startTime
  });

  // 3. Run checks
  const issues = [];
  for (const page of crawlResult.pages) {
    const pageIssues = runChecksOnPage(
      page,
      crawlResult.pages,
      contentHashes
    );
    issues.push(...pageIssues);
  }

  // 4. Build report
  return buildReport({
    baseUrl,
    pages: crawlResult.pages,
    issues,
    meta: {
      pagesCrawled: crawlResult.pages.length,
      crawlDepth: crawlResult.maxDepth,
      durationMs: Date.now() - startTime,
      hitLimit: crawlResult.hitLimit
    }
  });
}
