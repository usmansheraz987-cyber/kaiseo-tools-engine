import * as cheerio from "cheerio";
import { normalizeUrl } from "../utils/normalizeUrl.js";

export function checkLinks(page, allPages) {
  const issues = [];
  if (!page.html) return issues;

  const $ = cheerio.load(page.html);

  const seenLinks = new Set();
  const pageUrl = page.url;

  // Build lookup of crawled pages with status
  const pageMap = new Map(
    allPages.map(p => [p.url, p.status])
  );

  $("a[href]").each((_, el) => {
    let href = $(el).attr("href");
    if (!href) return;

    // Filter junk
    if (
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("javascript:")
    ) return;

    let url;
    try {
      url = normalizeUrl(new URL(href, pageUrl).toString());
    } catch {
      return;
    }

    // Only internal links
    if (!url.startsWith(pageUrl)) return;

    if (seenLinks.has(url)) return;
    seenLinks.add(url);

    // If destination was crawled and is broken → issue
    if (pageMap.has(url)) {
      const status = pageMap.get(url);
      if (status >= 400) {
        issues.push({
          code: "BROKEN_INTERNAL_LINK",
          page: pageUrl,
          target: url,
          severity: "critical",
          message: `Internal link returns ${status}`,
          why: "Broken links harm crawlability and UX",
          fix: "Update or remove the broken link"
        });
      }
    }
  });

  if (seenLinks.size === 0) {
    issues.push({
      code: "NO_INTERNAL_LINKS",
      page: pageUrl,
      severity: "important",
      message: "Page has no internal links",
      why: "Internal links help discovery and authority flow",
      fix: "Add relevant internal links"
    });
  }

  return issues;
}
