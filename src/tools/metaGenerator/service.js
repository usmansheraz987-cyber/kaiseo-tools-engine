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

function buildTitleVariants(keyword, intent) {
  if (intent === "transactional") {
    return [
      `Best ${keyword} Services You Can Trust`,
      `${keyword} Solutions That Actually Work`
    ];
  }
  return [
    `${keyword} Explained Simply`,
    `What Is ${keyword} and Why It Matters`
  ];
}

function buildDescriptionVariants(keyword, intent) {
  if (intent === "transactional") {
    return [
      `Looking for reliable ${keyword}? Learn how to choose the right option and get results that matter.`,
      `Discover proven ${keyword} solutions, pricing insights, and what to expect before you decide.`
    ];
  }
  return [
    `Learn what ${keyword} is, how it works, and why it plays an important role in real-world use.`,
    `A clear guide to ${keyword}, including examples, benefits, and practical explanations.`
  ];
}

function scoreVariant(text, keyword, min, max) {
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

export function generateMeta({ content, targetKeyword }) {
  const keyword = targetKeyword || extractPrimaryKeyword(content);
  const intent = detectIntent(content);

  const titles = buildTitleVariants(keyword, intent).map(t =>
    scoreVariant(t, keyword, TITLE_MIN, TITLE_MAX)
  );

  const descriptions = buildDescriptionVariants(keyword, intent).map(d =>
    scoreVariant(d, keyword, DESC_MIN, DESC_MAX)
  );

  const bestTitle = titles.sort((a, b) => b.scores.final - a.scores.final)[0];
  const bestDescription = descriptions.sort((a, b) => b.scores.final - a.scores.final)[0];

  return {
    keyword,
    intent,
    bestTitle: bestTitle.text,
    bestDescription: bestDescription.text,
    titles,
    descriptions,
    metaTags: {
      title: `<title>${bestTitle.text}</title>`,
      description: `<meta name="description" content="${bestDescription.text}">`
    }
  };
}
