import crypto from "crypto";
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

export async function runSiteAudit(req, res) {
  const { url, maxPages = 50, maxDepth = 3 } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL required" });
  }

  const auditId = crypto.randomUUID();

  // START PROGRESS
  progressStore.init(auditId, maxPages);

  // RESPOND IMMEDIATELY
  res.json({ auditId, status: "started" });

  // ---- BACKGROUND JOB ----
  const queue = new CrawlQueue({ maxPages, maxDepth });
  const pages = [];
  const allIssues = [];
  const incomingLinkMap = new Map();

  const dupStore = {
    titles: new Set(),
    descriptions: new Set()
  };

  try {
    const sitemapUrls = await fetchSitemapUrls(url, maxPages);
    sitemapUrls.forEach(u => queue.add(u, 1));
  } catch {}

  queue.add(url, 0);

  while (queue.hasNext()) {
    const item = queue.next();
    if (!item) break;

    try {
      const page = await crawlPage(item.url);
      if (!page || page.error) {
        progressStore.increment(auditId);
        continue;
      }

      if (!queue.markCanonical(page)) {
        progressStore.increment(auditId);
        continue;
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
    } catch {
      progressStore.increment(auditId);
    }
  }

  // SAVE RESULT
  const resultDir = path.resolve("src/tools/siteAudit/results");
  fs.mkdirSync(resultDir, { recursive: true });

  const groupedIssues = buildIssues(allIssues);
  const scoring = calculateScore(groupedIssues);

  const resultFile = path.join(resultDir, `${auditId}.json`);

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
