import { LIMITS, SEVERITY } from "./constants.js";
import {
  splitSentences,
  splitParagraphs,
  countWords,
  getKeywordDensity,
  getRepeatedPhrases
} from "./utils.js";

export function analyzeContent({ content, keyword }) {
  const issues = [];

  issues.push(...checkReadability(content));
  issues.push(...checkStructure(content));
  issues.push(...checkRepetition(content));

  if (keyword) {
    issues.push(...checkKeywordUsage(content, keyword));
  }

  return buildResponse(issues);
}

/* -------------------- CHECKS -------------------- */

function checkReadability(content) {
  const sentences = splitSentences(content);
  const longSentences = sentences.filter(
    s => countWords(s) > LIMITS.MAX_SENTENCE_LENGTH
  );

  if (!longSentences.length) return [];

  return [{
    type: "readability",
    severity: SEVERITY.HIGH,
    message: "Some sentences are too long.",
    whyItMatters: "Long sentences reduce clarity and make content harder to scan.",
    howToFix: `Split sentences longer than ${LIMITS.MAX_SENTENCE_LENGTH} words.`
  }];
}

function checkStructure(content) {
  const paragraphs = splitParagraphs(content);
  const issues = [];

  paragraphs.forEach(p => {
    const sentences = splitSentences(p);
    const wordCount = countWords(p);

    if (sentences.length > LIMITS.MAX_PARAGRAPH_SENTENCES) {
      issues.push({
        type: "structure",
        severity: SEVERITY.MEDIUM,
        message: "Some paragraphs are too dense.",
        whyItMatters: "Large paragraphs reduce readability, especially on mobile.",
        howToFix: "Break long paragraphs into smaller chunks."
      });
    }

    if (wordCount < LIMITS.MIN_PARAGRAPH_WORDS) {
      issues.push({
        type: "structure",
        severity: SEVERITY.LOW,
        message: "Some paragraphs are too short.",
        whyItMatters: "Very short paragraphs may feel underdeveloped.",
        howToFix: "Expand the idea or merge with a related paragraph."
      });
    }
  });

  return issues;
}

function checkRepetition(content) {
  const repeated = getRepeatedPhrases(content);
  if (!repeated.length) return [];

  return [{
    type: "repetition",
    severity: SEVERITY.MEDIUM,
    message: "Repeated phrases detected.",
    whyItMatters: "Repetition reduces perceived quality and may signal AI-like writing.",
    howToFix: "Rephrase or remove repeated phrases to improve flow."
  }];
}

function checkKeywordUsage(content, keyword) {
  const density = getKeywordDensity(content, keyword);

  if (density <= LIMITS.MAX_KEYWORD_DENSITY) return [];

  return [{
    type: "keyword",
    severity: SEVERITY.HIGH,
    message: "Keyword usage is too high.",
    whyItMatters: "Overusing keywords can harm readability and SEO performance.",
    howToFix: "Reduce usage or replace with natural variations."
  }];
}

/* -------------------- RESPONSE -------------------- */

function buildResponse(issues) {
  const severity =
    issues.some(i => i.severity === SEVERITY.HIGH) ? SEVERITY.HIGH :
    issues.some(i => i.severity === SEVERITY.MEDIUM) ? SEVERITY.MEDIUM :
    SEVERITY.LOW;

  return {
    summary: {
      issuesFound: issues.length,
      severity
    },
    issues
  };
}
