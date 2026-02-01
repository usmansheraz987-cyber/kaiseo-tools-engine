// src/tools/pageFit/phase3/overOptimization.js

/*
 Detects keyword over-optimization and SEO abuse.
 No scoring. Signals only.
*/

function normalize(text) {
  return text.toLowerCase();
}

function getText(dom) {
  if (!dom || !dom.body) return "";
  return dom.body.textContent || "";
}

function countOccurrences(text, phrase) {
  if (!phrase) return 0;
  const regex = new RegExp(`\\b${phrase}\\b`, "gi");
  const matches = text.match(regex);
  return matches ? matches.length : 0;
}

export default function detectOverOptimization({
  dom,
  primaryKeyword,
}) {
  if (!dom || !primaryKeyword) {
    return {
      overOptimized: false,
      reason: "missing_input",
    };
  }

  const text = normalize(getText(dom));
  const keyword = normalize(primaryKeyword);

  const wordCount = text.split(/\s+/).length;
  const keywordCount = countOccurrences(text, keyword);

  const keywordDensity = wordCount
    ? (keywordCount / wordCount) * 100
    : 0;

  const forcedUsage =
    keywordCount > 0 &&
    keywordDensity > 3; // aggressive, intentional

  const repeatedInHeadings = Array.from(
    dom.querySelectorAll("h1, h2, h3")
  ).filter(h =>
    normalize(h.textContent).includes(keyword)
  ).length;

  const headingStuffing = repeatedInHeadings >= 3;

  if (forcedUsage || headingStuffing) {
    return {
      overOptimized: true,
      keywordCount,
      wordCount,
      keywordDensity: Number(keywordDensity.toFixed(2)),
      headingMentions: repeatedInHeadings,
      reason: forcedUsage
        ? "keyword_density_too_high"
        : "keyword_repeated_in_headings",
    };
  }

  return {
    overOptimized: false,
    keywordCount,
    wordCount,
    keywordDensity: Number(keywordDensity.toFixed(2)),
    headingMentions: repeatedInHeadings,
  };
}
