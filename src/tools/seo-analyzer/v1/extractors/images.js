// src/tools/seoAnalyzer/v1/extractors/images.js

import { normalizeText } from "../utils.js";

export function extractImages($) {
  const images = $("img");

  let withAlt = 0;

  images.each((_, img) => {
    const alt = normalizeText($(img).attr("alt"));
    if (alt) withAlt++;
  });

  return {
    totalImages: images.length,
    imagesWithAlt: withAlt,
    imagesWithoutAlt: images.length - withAlt
  };
}

