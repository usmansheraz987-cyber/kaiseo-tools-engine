import fs from "fs";
import path from "path";

import { CrawlQueue } from "./crawl/queue.js";
import { crawlPage } from "./crawl/crawler.js";
import { resolveInternalLinks } from "./crawl/urlUtils.js";
import { fetchSitemapUrls } from "./crawl/sitemap.js";

import { analyzeIndexability } from "./analyze/indexability.js";
import { analyzeArchitecture } from "./analyze/architecture.js";
import { analyzeDuplication } from "./analyze/duplication.js";
import { analyzePerformance } from "./analyze/performance.js";
import { analyzeSecurity } from "./analyze/security.js";
import { analyzeRedirects } from "./analyze/redirects.js";

import { buildIssues } from "./aggregate/issueBuilder.js";
import { buildSummary } from "./aggregate/siteSummary.js";
import { calculateScore } from "./score/scoreEngine.js";

import { progressStore } from "./progress/fileStore.js";

export async function runAuditJob({ auditId, url, maxPages, maxDepth }) {
  const MAX_CRAWL_TIME = 60_000;
  const CONCURRENCY = 3;
  const crawlStart = Date.now();

  const queue = new CrawlQueue({ maxPages, maxDepth });
  const pages = [];
  const allIssues = [];
  const incomingLinkMap = new Map();

  const dupStore = {
    titles: new Set(),
    descriptions: new Set()
  };

  progressStore.init(auditId, maxPages);

  try {
    const sitemapUrls = await fetchSitemapUrls(url, maxPages);
    sitemapUrls.forEach(u => queue.add(u, 1));
  } catch {}

  queue.add(url, 0);

  const active = new Set();

  async function processNext() {
    if (!queue.hasNext()) return;

    if (Date.now() - crawlStart > MAX_CRAWL_TIME) {
      allIssues.push("crawl_timeout_reached");
      return;
    }

    const item = queue.next();
    if (!item) return;

    const task = (async () => {
      let page;
      try {
        page = await crawlPage(item.url);
      } catch {
        progressStore.increment(auditId);
        return;
      }

      if (!page || page.error || page.blocked || page.timeout) {
        progressStore.increment(auditId);
        return;
      }

      if (!queue.markCanonical(page)) {
        progressStore.increment(auditId);
        return;
      }

      const internalLinks = resolveInternalLinks(
        page.url,
        page.links || []
      );

      internalLinks.forEach(link => {
        incomingLinkMap.set(link, (incomingLinkMap.get(link) || 0) + 1);
        queue.add(link, item.depth + 1);
      });

      const issues = [
        ...analyzeIndexability(page),
        ...analyzeRedirects(page),
        ...analyzeArchitecture({
          depth: item.depth,
          outgoingLinks: internalLinks.length,
          incomingLinks: incomingLinkMap.get(page.url) || 0
        }),
        ...analyzeDuplication(dupStore, page),
        ...analyzePerformance(page),
        ...analyzeSecurity(page.url, page.html)
      ];

      allIssues.push(...issues);

      pages.push({
        url: page.url,
        status: page.status,
        depth: item.depth,
        internalLinks: internalLinks.length,
        issues
      });

      progressStore.increment(auditId);
    })();

    active.add(task);
    task.finally(() => active.delete(task));
  }

  while (queue.hasNext() || active.size > 0) {
    while (queue.hasNext() && active.size < CONCURRENCY) {
      processNext();
    }
    if (active.size > 0) {
      await Promise.race(active);
    }
  }

  // ---- SAVE RESULT TO FILE ----
  const resultDir = path.resolve("data/audits/results");
  fs.mkdirSync(resultDir, { recursive: true });

  const resultFile = path.join(resultDir, `${auditId}.json`);

  const groupedIssues = buildIssues(allIssues);
  const scoring = calculateScore(groupedIssues);

  fs.writeFileSync(
    resultFile,
    JSON.stringify(
      {
        meta: { auditId, auditedUrl: url },
        summary: buildSummary(pages),
        score: scoring,
        issues: groupedIssues,
        pages
      },
      null,
      2
    )
  );

  progressStore.finish(auditId, resultFile);
}
