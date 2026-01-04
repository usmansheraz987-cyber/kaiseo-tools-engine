import {
  cleanText,
  generateNgrams,
  countOccurrences,
  classify,
  extractTextFromUrl
} from "./utils.js";

export default async function analyzeKeywordDensityV2({ text, targets, url }) {
  let inputText = text;

  // URL mode
  if (url) {
    inputText = await extractTextFromUrl(url);
  }

  if (!inputText || typeof inputText !== "string") {
    return { error: "Text or URL is required" };
  }

  const cleaned = cleanText(inputText);
  const words = cleaned.split(" ");
  const totalWords = words.length;

  const targetsSet = Array.isArray(targets)
    ? new Set(targets.map(t => cleanText(t)))
    : null;

  const results = [];

  // 1-gram, 2-gram, 3-gram
  for (const n of [1, 2, 3]) {
    const grams = generateNgrams(words, n);
    const freq = countOccurrences(grams);

    for (const [keyword, count] of Object.entries(freq)) {
      if (count < 2 && !targetsSet) continue;
      if (targetsSet && !targetsSet.has(keyword)) continue;

      const density = Number(((count / totalWords) * 100).toFixed(2));
      const warning = classify(count, density, totalWords);

      results.push({
        keyword,
        count,
        density,
        type: targetsSet ? "target" : "auto",
        warning
      });
    }
  }

  const summary = results.reduce(
    (acc, r) => {
      acc[r.warning] = (acc[r.warning] || 0) + 1;
      return acc;
    },
    {}
  );

  return {
    totalWords,
    keywords: results.sort((a, b) => b.count - a.count),
    summary
  };
}
