import { LIMITS } from "./constants.js";
import {
  splitSentences,
  splitParagraphs,
  countWords,
  getKeywordDensity,
  getRepeatedPhrases
} from "./utils.js";

export function calculateMetrics(content, keyword) {
  const sentences = splitSentences(content);
  const paragraphs = splitParagraphs(content);
  const totalWords = countWords(content);

  const sentenceLengths = sentences.map(s => countWords(s));
  const avgSentenceLength =
    sentenceLengths.reduce((a, b) => a + b, 0) / sentences.length;

  const longSentenceCount =
    sentenceLengths.filter(w => w > LIMITS.MAX_SENTENCE_LENGTH).length;

  const repetitionData = getRepeatedPhrases(content);

  return {
    average_sentence_length: Number(avgSentenceLength.toFixed(2)),
    long_sentence_percentage: Number(
      ((longSentenceCount / sentences.length) * 100).toFixed(2)
    ),
    paragraph_variance: calculateParagraphVariance(paragraphs),
    repetition_rate: calculateRepetitionRate(repetitionData, totalWords),
    top_repeated_phrases: repetitionData.slice(0, 3),
    keyword_density: keyword
      ? Number(getKeywordDensity(content, keyword).toFixed(2))
      : null,
    word_count: totalWords,
    sentence_count: sentences.length,
    paragraph_count: paragraphs.length
  };
}

function calculateParagraphVariance(paragraphs) {
  const lengths = paragraphs.map(p => countWords(p));
  const avg =
    lengths.reduce((a, b) => a + b, 0) / lengths.length;

  const variance =
    lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) /
    lengths.length;

  return Number(variance.toFixed(2));
}

function calculateRepetitionRate(repeated, totalWords) {
  if (!repeated.length) return 0;

  const totalRepeated = repeated.reduce(
    (sum, r) => sum + r.count,
    0
  );

  return Number((totalRepeated / totalWords).toFixed(4));
}