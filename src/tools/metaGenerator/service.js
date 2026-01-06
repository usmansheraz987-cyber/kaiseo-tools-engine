import {
  TITLE_MIN,
  TITLE_MAX,
  DESC_MIN,
  DESC_MAX
} from "./constants.js";

import {
  extractPrimaryKeyword,
  detectIntent,
  scoreLength,
  scoreKeywordPresence
} from "./utils.js";

/* ---------- builders ---------- */

function buildTitleVariants(keyword, intent) {
  if (!keyword) return [];

  if (intent === "transactional") {
    return [
      `Best ${keyword} Services for Businesses That Want Real Results`,
      `${keyword} Solutions That Help You Grow Traffic and Conversions`
    ];
  }

  return [
    `${keyword} Explained Simply: Meaning, Benefits, and Real Examples`,
    `What Is ${keyword}? A Clear Guide for Beginners and Professionals`
  ];
}

function buildDescriptionVariants(keyword, intent) {
  if (!keyword) return [];

  if (intent === "transactional") {
    return [
      `Looking for reliable ${keyword} services? Learn how to choose the right solution, avoid common mistakes, and get measurable results.`,
      `Discover how professional ${keyword} solutions work, what they cost, and how they help businesses grow faster online.`
    ];
  }

  return [
    `Learn what ${keyword} is, how it works, why it matters, and how it helps websites improve visibility, traffic, and long-term performance.`,
    `This complete guide explains ${keyword} with clear examples, real benefits, and practical insights you can actually use.`
  ];
}

/* ---------- scoring ---------- */

function scoreVariant(text, keyword, min, max) {
  if (!text || typeof text !== "string") {
    return {
      text: "",
      scores: { length: 0, keyword: 0, final: 0 }
    };
  }

  const lengthScore = scoreLength(text.length, min, max);
  const keywordScore = scoreKeywordPresence(text, keyword);
  const finalScore = Math.round((lengthScore + keywordScore) / 2);

  return {
    text,
    scores: {
      length: lengthScore,
      keyword: keywordScore,
      final: finalScore
    }
  };
}

/* ---------- main engine ---------- */

export function generateMeta({ content = "", targetKeyword = "" }) {
  if (!content || content.length < 50) {
    return {
      error: "Content too short for meta generation"
    };
  }

  const keyword = targetKeyword || extractPrimaryKeyword(content);
  const intent = detectIntent(content);

  const rawTitles = buildTitleVariants(keyword, intent);
  const rawDescriptions = buildDescriptionVariants(keyword, intent);

  const titles = rawTitles
    .filter(v => typeof v === "string" && v.length > 0)
    .map(t => scoreVariant(t, keyword, TITLE_MIN, TITLE_MAX));

  const descriptions = rawDescriptions
    .filter(v => typeof v === "string" && v.length > 0)
    .map(d => scoreVariant(d, keyword, DESC_MIN, DESC_MAX));

  const bestTitle =
    titles.sort((a, b) => b.scores.final - a.scores.final)[0] || null;

  const bestDescription =
    descriptions.sort((a, b) => b.scores.final - a.scores.final)[0] || null;

  return {
    keyword,
    intent,
    bestTitle: bestTitle ? bestTitle.text : "",
    bestDescription: bestDescription ? bestDescription.text : "",
    titles,
    descriptions,
    metaTags: {
      title: bestTitle ? `<title>${bestTitle.text}</title>` : "",
      description: bestDescription
        ? `<meta name="description" content="${bestDescription.text}">`
        : ""
    }
  };
}
