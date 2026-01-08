// src/tools/seoAnalyzer/v1/extractors/headings.js

import { normalizeText } from "../utils.js";

export function extractHeadings($) {
  const headings = {};

  ["h1", "h2", "h3", "h4", "h5", "h6"].forEach(tag => {
    headings[tag] = $(tag)
      .map((_, el) => normalizeText($(el).text()))
      .get()
      .filter(Boolean);
  });

  return {
    h1Count: headings.h1.length,
    h2Count: headings.h2.length,
    structure: headings
  };
}
