// tools/readability/v1/textUtils.js

/**
 * Split text into paragraphs.
 * Paragraphs are separated by one or more empty lines.
 */
export function splitParagraphs(text = "") {
  if (!text) return [];

  return text
    .split(/\n\s*\n+/)
    .map(p => p.trim())
    .filter(Boolean);
}

/**
 * Split text into sentences.
 * Simple heuristic, good enough for readability scoring.
 */
export function splitSentences(text = "") {
  if (!text) return [];

  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Tokenize text into words.
 * Lowercase, strip punctuation, keep numbers.
 */
export function tokenizeWords(text = "") {
  if (!text) return [];

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Rough syllable counter.
 * Heuristic-based (acceptable for readability formulas).
 */
export function countSyllables(word = "") {
  if (!word) return 0;

  const cleaned = word
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  if (cleaned.length <= 3) return 1;

  const matches = cleaned.match(/[aeiouy]{1,2}/g);
  let count = matches ? matches.length : 0;

  // silent trailing "e"
  if (cleaned.endsWith("e")) count--;

  return count > 0 ? count : 1;
}
