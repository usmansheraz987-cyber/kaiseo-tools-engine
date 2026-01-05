import {
  cleanText,
  generateNgrams,
  countOccurrences,
  extractTextFromUrl,
  isMeaningful
} from "../v2/utils.js";

// helper: extract phrase frequencies
function extractPhrases(text) {
  const cleaned = cleanText(text);
  const words = cleaned.split(" ").filter(Boolean);
  const totalWords = words.length;

  const phrases = {};

  for (const n of [2, 3]) {
    const grams = generateNgrams(words, n);
    const freq = countOccurrences(grams);

    for (const [phrase, count] of Object.entries(freq)) {
      if (count < 2) continue;
      if (!isMeaningful(phrase)) continue;

      phrases[phrase] = {
        count,
        density: Number(((count / totalWords) * 100).toFixed(2))
      };
    }
  }

  return { phrases, totalWords };
}

export default async function keywordDensityGapService({ url, competitors }) {
  if (!url || !Array.isArray(competitors) || competitors.length === 0) {
    return { error: "URL and competitors are required" };
  }

  // YOUR PAGE
  const yourText = await extractTextFromUrl(url);
  const yourData = extractPhrases(yourText);

  // COMPETITORS
  const competitorPhraseMaps = [];

  for (const compUrl of competitors) {
    try {
      const text = await extractTextFromUrl(compUrl);
      competitorPhraseMaps.push(extractPhrases(text).phrases);
    } catch {
      // skip failed competitor
    }
  }

  if (competitorPhraseMaps.length === 0) {
    return { error: "Unable to fetch competitor content" };
  }

  // MERGE COMPETITOR AVERAGES
  const competitorAvg = {};

  for (const map of competitorPhraseMaps) {
    for (const [phrase, data] of Object.entries(map)) {
      if (!competitorAvg[phrase]) {
        competitorAvg[phrase] = { total: 0, count: 0 };
      }
      competitorAvg[phrase].total += data.count;
      competitorAvg[phrase].count += 1;
    }
  }

  const gaps = [];

  for (const [phrase, stats] of Object.entries(competitorAvg)) {
    const avgCount = stats.total / stats.count;
    const yourCount = yourData.phrases[phrase]?.count || 0;

    // GAP RULES
    if (
      yourCount === 0 && avgCount >= 2 ||
      yourCount > 0 && yourCount < avgCount * 0.5
    ) {
      gaps.push({
        phrase,
        you: yourCount,
        competitorsAvg: Math.round(avgCount),
        action: yourCount === 0 ? "add" : "increase"
      });
    }
  }

  const STOP_PHRASES = [
  "a list of",
  "let's say",
  "if you're",
  "you want to",
  "step by step",
  "there's how"
];

const filteredGaps = gaps.filter(g => {
  if (g.phrase.length < 6) return false; // too short
  if (STOP_PHRASES.includes(g.phrase)) return false;
  if (g.competitorsAvg < 3) return false; // weak signal
  return true;
});


  // phrase-first sorting
  gaps.sort((a, b) => {
    const aLen = a.phrase.split(" ").length;
    const bLen = b.phrase.split(" ").length;
    if (aLen !== bLen) return bLen - aLen;
    return b.competitorsAvg - a.competitorsAvg;
  });

return {
  tool: "keyword-density-gap",
  url,
  competitors: competitorUrls.length,
  gaps: grouped
};

}
