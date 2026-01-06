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


export function generateMeta({ content, targetKeyword }) {
  const keyword = targetKeyword || extractPrimaryKeyword(content);
  const intent = detectIntent(content);

const titles = buildTitleVariants(keyword, intent)
  .filter(Boolean)
  .map(t => scoreVariant(t, keyword, TITLE_MIN, TITLE_MAX));


const descriptions = buildDescriptionVariants(keyword, intent)
  .filter(Boolean)
  .map(d => scoreVariant(d, keyword, DESC_MIN, DESC_MAX));


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
