// src/tools/seoAnalyzer/v1/extractors/meta.js

import { normalizeText } from "../utils.js";

export function extractMeta($) {
  const title = normalizeText($("title").first().text());

  const metaDescription = normalizeText(
    $('meta[name="description"]').attr("content")
  );

  const robots = normalizeText(
    $('meta[name="robots"]').attr("content")
  );

  const canonical = normalizeText(
    $('link[rel="canonical"]').attr("href")
  );

  return {
    title: title || null,
    titleLength: title ? title.length : 0,

    metaDescription: metaDescription || null,
    metaDescriptionLength: metaDescription ? metaDescription.length : 0,

    robots: robots || null,
    canonical: canonical || null
  };
}
