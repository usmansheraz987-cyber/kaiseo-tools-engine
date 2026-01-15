// src/tools/siteAudit/analyze/indexability.js

import * as cheerio from "cheerio";

export function analyzeIndexability(page) {
  const issues = [];

  const { status, html, url, finalUrl, headers } = page;

  // HTTP status checks
  if (status >= 400) {
    issues.push("non_indexable_status");
  }

  // Redirected URL
  if (finalUrl && finalUrl !== url) {
    issues.push("redirected_url");
  }

  if (!html) return issues;

  const $ = cheerio.load(html);

  // Meta robots
  const metaRobots = $('meta[name="robots"]').attr("content");
  if (metaRobots) {
    const content = metaRobots.toLowerCase();

    if (content.includes("noindex")) {
      issues.push("meta_noindex");
    }

    if (content.includes("nofollow")) {
      issues.push("meta_nofollow");
    }
  }

  // Canonical tag
const canonical = $('link[rel="canonical"]').attr("href");
if (canonical) {
  try {
    const canonicalUrl = new URL(canonical, url).origin;
    const pageOrigin = new URL(url).origin;

    if (canonicalUrl !== pageOrigin) {
      issues.push("canonical_mismatch");
    }
  } catch {
    issues.push("invalid_canonical");
  }
} else {
  issues.push("missing_canonical");
}


  // X-Robots-Tag (header-level)
  const xRobots = headers?.["x-robots-tag"];
  if (xRobots) {
    const value = xRobots.toLowerCase();
    if (value.includes("noindex")) {
      issues.push("xrobots_noindex");
    }
  }

  return issues;
}
