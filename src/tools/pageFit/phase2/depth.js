// src/tools/pageFit/phase2/depth.js

/**
 * Evaluates content depth by measuring repetition vs expansion
 * No topic modeling. No AI. Pure structure signals.
 */
export function analyzeContentDepth(extractedContent) {
  const text = extractedContent?.text || "";
  const wordCount = extractedContent?.wordCount || 0;

  if (!text || wordCount === 0) {
    return {
      wordCount: 0,
      uniqueSentenceRatio: 0,
      repeatedSentences: 0,
      depthSignal: "low",
      thinContent: true
    };
  }

  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  const sentenceCount = sentences.length;

  if (sentenceCount === 0) {
    return {
      wordCount,
      uniqueSentenceRatio: 0,
      repeatedSentences: 0,
      depthSignal: "low",
      thinContent: true
    };
  }

  const uniqueSentences = new Set(sentences);
  const uniqueSentenceRatio =
    uniqueSentences.size / sentenceCount;

  const repeatedSentences =
    sentenceCount - uniqueSentences.size;

  let depthSignal = "average";

  if (uniqueSentenceRatio > 0.9 && wordCount > 600) {
    depthSignal = "high";
  } else if (uniqueSentenceRatio < 0.6) {
    depthSignal = "low";
  }

  return {
    wordCount,
    uniqueSentenceRatio: Number(uniqueSentenceRatio.toFixed(2)),
    repeatedSentences,
    depthSignal,
    thinContent: wordCount < 300 || depthSignal === "low"
  };
}
