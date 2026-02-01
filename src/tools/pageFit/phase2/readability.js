// src/tools/pageFit/phase2/readability.js

/**
 * Analyzes sentence-level readability signals
 * No grades, no advice, no scoring
 */
export function analyzeReadability(extractedContent) {
  const text = extractedContent?.text || "";

  if (!text) {
    return {
      sentenceCount: 0,
      avgWordsPerSentence: 0,
      longSentences: 0,
      passiveSignal: 0,
      hardToRead: true
    };
  }

  // Basic sentence split (deterministic, language-agnostic)
  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(Boolean);

  const sentenceCount = sentences.length;

  if (sentenceCount === 0) {
    return {
      sentenceCount: 0,
      avgWordsPerSentence: 0,
      longSentences: 0,
      passiveSignal: 0,
      hardToRead: true
    };
  }

  const wordCounts = sentences.map(s =>
    s.split(/\s+/).filter(Boolean).length
  );

  const avgWordsPerSentence = Math.round(
    wordCounts.reduce((a, b) => a + b, 0) / sentenceCount
  );

  const longSentences = wordCounts.filter(wc => wc > 25).length;

  // Passive signal (very light heuristic, not grammar)
  const passiveMatches = text.match(/\b(is|was|were|been|being)\b\s+\w+ed\b/gi) || [];
  const passiveSignal = passiveMatches.length;

  return {
    sentenceCount,
    avgWordsPerSentence,
    longSentences,
    passiveSignal,
    hardToRead:
      avgWordsPerSentence > 25 ||
      longSentences > sentenceCount * 0.4
  };
}
