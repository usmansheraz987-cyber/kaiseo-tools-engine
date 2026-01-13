import cheerio from "cheerio";

export function checkLinks(page, allPages) {
  const issues = [];
  if (!page.html) return issues;

  const $ = cheerio.load(page.html);
  const internalLinks = [];

  $("a[href]").each((_, el) => {
    try {
      const href = $(el).attr("href");
      const url = new URL(href, page.url).toString();
      internalLinks.push(url);
    } catch {}
  });

  const knownUrls = new Set(allPages.map(p => p.url));

  internalLinks.forEach(link => {
    if (!knownUrls.has(link)) {
      issues.push({
        code: "BROKEN_INTERNAL_LINK",
        page: page.url,
        severity: "critical",
        message: "Broken internal link detected",
        why: "Broken links harm crawlability and UX",
        fix: "Update or remove the broken link"
      });
    }
  });

  if (internalLinks.length === 0) {
    issues.push({
      code: "NO_INTERNAL_LINKS",
      page: page.url,
      severity: "important",
      message: "Page has no internal links",
      why: "Internal links help discovery and authority flow",
      fix: "Add relevant internal links"
    });
  }

  return issues;
}
