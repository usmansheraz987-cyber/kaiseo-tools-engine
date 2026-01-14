// src/tools/siteAudit/analyze/security.js

import * as cheerio from "cheerio";

export function analyzeSecurity(url, html) {
  const issues = [];

  // HTTPS check
  if (!url.startsWith("https://")) {
    issues.push("not_https");
  }

  if (!html) return issues;

  const $ = cheerio.load(html);

  // Mixed content: http assets on https page
  if (url.startsWith("https://")) {
    $("img[src], script[src], link[href]").each((_, el) => {
      const src = $(el).attr("src") || $(el).attr("href");
      if (src && src.startsWith("http://")) {
        issues.push("mixed_content");
        return false; // stop after first hit
      }
    });
  }

  // Insecure canonical
  const canonical = $('link[rel="canonical"]').attr("href");
  if (canonical && canonical.startsWith("http://")) {
    issues.push("insecure_canonical");
  }

  return issues;
}
