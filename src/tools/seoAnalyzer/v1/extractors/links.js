// src/tools/seoAnalyzer/v1/extractors/links.js

import { getDomain } from "../utils.js";

export function extractLinks($, pageUrl) {
  const pageDomain = getDomain(pageUrl);

  let internal = 0;
  let external = 0;

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");

    if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
      return;
    }

    try {
      const linkDomain = getDomain(
        href.startsWith("http") ? href : pageUrl
      );

      if (linkDomain === pageDomain) internal++;
      else external++;
    } catch {
      // ignore malformed links
    }
  });

  return {
    internalLinks: internal,
    externalLinks: external,
    totalLinks: internal + external
  };
}
