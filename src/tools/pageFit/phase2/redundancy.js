// src/tools/pageFit/phase2/redundancy.js

/**
 * Detects internal redundancy and fluff
 * Measures idea repetition, not exact duplicates
 */
export function analyzeRedundancy(extractedContent) {
  const text = extractedContent?.text || "";

  if (!text) {
    return {
      totalSentences: 0,
      nearDuplicateSentences: 0,
      redundancyRatio: 0,
      fluffDetected: false
    };
  }

  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  const totalSentences = sentences.length;

  if (totalSentences === 0) {
    return {
      totalSentences: 0,
      nearDuplicateSentences: 0,
      redundancyRatio: 0,
      fluffDetected: false
    };
  }

  let nearDuplicateSentences = 0;

  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const a = sentences[i];
      const b = sentences[j];

      // Very light similarity check
      const aWords = new Set(a.split(/\s+/));
      const bWords = new Set(b.split(/\s+/));

      const commonWords = [...aWords].filter(w => bWords.has(w));

      const similarity =
        commonWords.length /
        Math.max(aWords.size, bWords.size);

      if (similarity > 0.8) {
        nearDuplicateSentences++;
        break;
      }
    }
  }

  const redundancyRatio =
    nearDuplicateSentences / totalSentences;

  return {
    totalSentences,
    nearDuplicateSentences,
    redundancyRatio: Number(redundancyRatio.toFixed(2)),
    fluffDetected: redundancyRatio > 0.25
  };
}
