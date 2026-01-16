// src/tools/siteAudit/controller.js

import crypto from "crypto";

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

import {
  initProgress,
  incrementProgress,
  finishProgress
} from "./progress/store.js";

export async function runSiteAudit(req, res) {
  const { url, maxPages = 50, maxDepth = 3 } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // -------- audit + timeout setup --------
  const auditId = crypto.randomUUID();
  const MAX_CRAWL_TIME = 60_000; // 60 seconds
  const crawlStart = Date.now();

  // -------- crawl state --------
  const queue = new CrawlQueue({ maxPages, maxDepth });
  const pages = [];
  const allIssues = [];
  const incomingLinkMap = new Map();

  const dupStore = {
    titles: new Set(),
    descriptions: new Set()
  };

  // -------- progress init --------
  initProgress(auditId, maxPages);

  // -------- sitemap discovery --------
  try {
    const sitemapUrls = await fetchSitemapUrls(url, maxPages);
    sitemapUrls.forEach(sitemapUrl => {
      queue.add(sitemapUrl, 1);
    });
  } catch {
    // sitemap is optional, ignore failures
  }

  // always crawl entry URL
  queue.add(url, 0);

  // -------- crawl loop --------
  while (queue.hasNext()) {
    // global timeout guard
    if (Date.now() - crawlStart > MAX_CRAWL_TIME) {
      allIssues.push("crawl_timeout_reached");
      break;
    }

    const item = queue.next();
    const page = await crawlPage(item.url);

    if (!page || page.error || page.blocked || page.timeout) {
      allIssues.push("blocked_or_failed_page");
      incrementProgress(auditId);
      continue;
    }

    const internalLinks = resolveInternalLinks(
      page.finalUrl || page.url,
      page.links || []
    );

    // track incoming links
    internalLinks.forEach(link => {
      incomingLinkMap.set(link, (incomingLinkMap.get(link) || 0) + 1);
    });

    // expand crawl
    internalLinks.forEach(link => {
      queue.add(link, item.depth + 1);
    });

    // -------- analyzers --------
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

    incrementProgress(auditId);
  }

  // -------- finalize --------
  finishProgress(auditId);

  const groupedIssues = buildIssues(allIssues);
  const scoring = calculateScore(groupedIssues);

  return res.json({
    meta: {
      auditId,
      auditedUrl: url,
      crawledPages: pages.length
    },
    summary: buildSummary(pages),
    score: {
      site: scoring.siteScore,
      categories: scoring.categoryScores
    },
    issues: groupedIssues,
    pages: pages.map(p => ({
      url: p.url,
      depth: p.depth,
      status: p.status,
      internalLinks: p.internalLinks,
      issueCount: p.issues.length,
      issues: p.issues
    }))
  });
}
