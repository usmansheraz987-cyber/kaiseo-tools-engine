import { LIMITS, SEVERITY, SCORE_WEIGHTS } from "./constants.js";
import {
  splitSentences,
  splitParagraphs,
  countWords,
  getKeywordDensity,
  getRepeatedPhrases
} from "../v1/utils.js"; // ✅ FIXED PATH

export function runDetectors(content, keyword) {
  const sentences = splitSentences(content);
  const paragraphs = splitParagraphs(content);

  let issues = [];

  issues.push(...detectLongSentences(sentences));
  issues.push(...detectParagraphIssues(paragraphs));
  issues.push(...detectRepetition(content));

  if (keyword) {
    issues.push(...detectKeywordOveruse(content, keyword));
  }

  issues.sort((a, b) => b.impact_score - a.impact_score);

  issues.forEach((issue, index) => {
    issue.priority_rank = index + 1;
  });

  return issues;
}

/* ------------------ DETECTORS ------------------ */

function detectLongSentences(sentences) {
  const results = [];

  sentences.forEach((s, index) => {
    const words = countWords(s);

    if (words > LIMITS.MAX_SENTENCE_LENGTH) {
      const isVeryLong = words > LIMITS.MAX_SENTENCE_LENGTH * 1.5;

      results.push({
        sentence_index: index,
        sentence_text: s,
        word_count: words,
        issue_type: "long_sentence",
        severity: isVeryLong ? SEVERITY.HIGH : SEVERITY.MEDIUM,
        impact_score: isVeryLong
          ? SCORE_WEIGHTS.VERY_LONG_SENTENCE
          : SCORE_WEIGHTS.LONG_SENTENCE,
        suggestion: `Split into sentences under ${LIMITS.MAX_SENTENCE_LENGTH} words.`
      });
    }
  });

  return results;
}

function detectParagraphIssues(paragraphs) {
  const results = [];

  paragraphs.forEach((p, index) => {
    const sentences = splitSentences(p);
    const wordCount = countWords(p);

    if (sentences.length > LIMITS.MAX_PARAGRAPH_SENTENCES) {
      results.push({
        sentence_index: null,
        sentence_text: p,
        word_count: wordCount,
        issue_type: "dense_paragraph",
        severity: SEVERITY.MEDIUM,
        impact_score: SCORE_WEIGHTS.DENSE_PARAGRAPH,
        suggestion: "Break into smaller paragraphs."
      });
    }

    if (wordCount < LIMITS.MIN_PARAGRAPH_WORDS) {
      results.push({
        sentence_index: null,
        sentence_text: p,
        word_count: wordCount,
        issue_type: "short_paragraph",
        severity: SEVERITY.LOW,
        impact_score: SCORE_WEIGHTS.SHORT_PARAGRAPH,
        suggestion: "Expand or merge with related paragraph."
      });
    }
  });

  return results;
}

function detectRepetition(content) {
  const repeated = getRepeatedPhrases(content);

  if (!repeated.length) return [];

  return [{
    sentence_index: null,
    sentence_text: null,
    word_count: null,
    issue_type: "repetition",
    severity: SEVERITY.MEDIUM,
    impact_score: SCORE_WEIGHTS.REPETITION,
    suggestion: "Reduce repeated phrases."
  }];
}

function detectKeywordOveruse(content, keyword) {
  const density = getKeywordDensity(content, keyword);

  if (density <= LIMITS.MAX_KEYWORD_DENSITY) return [];

  return [{
    sentence_index: null,
    sentence_text: null,
    word_count: null,
    issue_type: "keyword_overuse",
    severity: SEVERITY.HIGH,
    impact_score: SCORE_WEIGHTS.KEYWORD_OVERUSE,
    suggestion: `Reduce keyword usage below ${LIMITS.MAX_KEYWORD_DENSITY}%.`
  }];
}