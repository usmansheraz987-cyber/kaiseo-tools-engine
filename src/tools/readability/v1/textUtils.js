// tools/readability/v1/textUtils.js

/**
 * Split text into paragraphs.
 * Paragraphs are separated by one or more empty lines.
 */
function splitParagraphs(text = "") {
  if (!text) return [];
  return text
    .split(/\n\s*\n+/)
    .map(p => p.trim())
    .filter(Boolean);
}

/**
 * Split text into sentences.
 * Simple heuristic. Good enough for readability scoring.
 */
function splitSentences(text = "") {
  if (!text) return [];
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

/**
 * Tokenize text into words.
 * Lowercase, remove punctuation, keep numbers.
 */
function tokenizeWords(text = "") {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Rough syllable counter.
 * Heuristic-based. Accuracy is acceptable for readability formulas.
 */
function countSyllables(word = "") {
  if (!word) return 0;

  const cleaned = word
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  if (cleaned.length <= 3) return 1;

  const vowels = cleaned.match(/[aeiouy]{1,2}/g);
  let count = vowels ? vowels.length : 0;

  // Silent "e"
  if (cleaned.endsWith("e")) count--;

  return count > 0 ? count : 1;
}

module.exports = {
  splitParagraphs,
  splitSentences,
  tokenizeWords,
  countSyllables
};
