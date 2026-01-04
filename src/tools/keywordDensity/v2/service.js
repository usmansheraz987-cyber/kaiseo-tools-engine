import {
  cleanText,
  generateNgrams,
  countOccurrences,
  classify,
  extractTextFromUrl,
  isMeaningful
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
  const words = cleaned.split(" ").filter(Boolean);
  const totalWords = words.length;

  const targetsSet = Array.isArray(targets)
    ? new Set(targets.map(t => cleanText(t)))
    : null;

  const results = [];

  // Generate 1-gram, 2-gram, 3-gram
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

  // STEP 3 — Stop-word filtering + phrase-first sorting
  const meaningful = results.filter(r => isMeaningful(r.keyword));
  const noise = results.filter(r => !isMeaningful(r.keyword));

  meaningful.sort((a, b) => {
    const aLen = a.keyword.split(" ").length;
    const bLen = b.keyword.split(" ").length;

    // phrases first: 3-word → 2-word → 1-word
    if (aLen !== bLen) return bLen - aLen;

    // then higher density
    return b.density - a.density;
  });

  const summary = meaningful.reduce(
    (acc, r) => {
      acc[r.warning] = (acc[r.warning] || 0) + 1;
      return acc;
    },
    {}
  );

  return {
    tool: "keyword-density-v2",
    mode: url ? "url" : "text",
    totalWords,
    keywords: meaningful,
    hidden: {
      removed: noise.length,
      reason: "stop-words"
    },
    summary
  };
}
