// src/tools/siteAudit/analyze/duplication.js

import * as cheerio from "cheerio";

export function analyzeDuplication(dupStore, page) {
  const issues = [];

  if (!page.html) return issues;

  const $ = cheerio.load(page.html);

  // ---------- TITLE ----------
  const title = $("title").text().trim();
  if (title) {
    if (dupStore.titles.has(title)) {
      issues.push("duplicate_title");
    } else {
      dupStore.titles.add(title);
    }
  }

  // ---------- META DESCRIPTION ----------
  const description = $('meta[name="description"]').attr("content")?.trim();
  if (description) {
    if (dupStore.descriptions.has(description)) {
      issues.push("duplicate_meta_description");
    } else {
      dupStore.descriptions.add(description);
    }
  }

  // ---------- URL PARAMETERS ----------
  try {
    const u = new URL(page.url);
    if (u.search && u.search.length > 0) {
      issues.push("url_parameter_duplicate");
    }
  } catch {}

  return issues;
}
