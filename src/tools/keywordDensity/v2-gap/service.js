import {
  extractTextFromUrl,
  cleanText,
  generateNgrams,
  countOccurrences,
  isMeaningful
} from "../v2/utils.js";

export default async function keywordDensityGapService({ url, competitors }) {
  if (!url || !Array.isArray(competitors) || competitors.length === 0) {
    return { error: "URL and competitors are required" };
  }

  // ─────────────────────────────
  // 1. Extract YOUR content
  // ─────────────────────────────
  let yourText;
  try {
    yourText = await extractTextFromUrl(url);
  } catch {
    return { error: "Failed to fetch your page content" };
  }

  const yourWords = cleanText(yourText).split(" ").filter(Boolean);
  const yourPhrases = extractPhrases(yourWords);

  // ─────────────────────────────
  // 2. Extract COMPETITOR content
  // ─────────────────────────────
  const competitorPhraseMaps = [];

  for (const compUrl of competitors) {
    try {
      const text = await extractTextFromUrl(compUrl);
      const words = cleanText(text).split(" ").filter(Boolean);
      competitorPhraseMaps.push(extractPhrases(words));
    } catch {
      // skip blocked competitor
    }
  }

  if (competitorPhraseMaps.length === 0) {
    return { error: "Unable to fetch competitor content" };
  }

  // ─────────────────────────────
  // 3. Merge competitor averages
  // ─────────────────────────────
  const competitorAvg = {};

  for (const map of competitorPhraseMaps) {
    for (const [phrase, count] of Object.entries(map)) {
      if (!competitorAvg[phrase]) {
        competitorAvg[phrase] = { total: 0, count: 0 };
      }
      competitorAvg[phrase].total += count;
      competitorAvg[phrase].count += 1;
    }
  }

  // ─────────────────────────────
  // 4. GAP RULES
  // ─────────────────────────────
  const gaps = [];

  for (const [phrase, stats] of Object.entries(competitorAvg)) {
    if (!isMeaningful(phrase)) continue;

    const avg = stats.total / stats.count;
    const you = yourPhrases[phrase] || 0;

    if (
      (you === 0 && avg >= 2) ||
      (you > 0 && you < avg * 0.5)
    ) {
      gaps.push({
        phrase,
        you,
        competitorsAvg: Math.round(avg),
        action: you === 0 ? "add" : "increase"
      });
    }
  }

  // ─────────────────────────────
  // 5. FILTER NOISE
  // ─────────────────────────────
  const STOP_PHRASES = [
    "list of",
    "let s say",
    "if you re",
    "you want to",
    "step by step",
    "there s how"
  ];

  const filteredGaps = gaps.filter(g => {
    if (g.phrase.split(" ").length < 2) return false;
    if (STOP_PHRASES.includes(g.phrase)) return false;
    if (g.competitorsAvg < 3) return false;
    return true;
  });

  // ─────────────────────────────
  // 6. PHRASE-FIRST SORTING
  // ─────────────────────────────
  filteredGaps.sort((a, b) => {
    const aLen = a.phrase.split(" ").length;
    const bLen = b.phrase.split(" ").length;
    if (aLen !== bLen) return bLen - aLen;
    return b.competitorsAvg - a.competitorsAvg;
  });

  // ─────────────────────────────
  // 7. FINAL RETURN
  // ─────────────────────────────
  return {
    tool: "keyword-density-gap",
    url,
    competitors: competitors.length,
    phraseGaps: filteredGaps
  };
}

// ─────────────────────────────
// Helper: phrase extraction
// ─────────────────────────────
function extractPhrases(words) {
  const phrases = {};

  for (const n of [2, 3]) {
    const grams = generateNgrams(words, n);
    const freq = countOccurrences(grams);
    for (const [k, v] of Object.entries(freq)) {
      phrases[k] = (phrases[k] || 0) + v;
    }
  }

  return phrases;
}
