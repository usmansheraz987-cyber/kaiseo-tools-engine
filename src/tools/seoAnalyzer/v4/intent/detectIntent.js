import { INTENT_RULES, normalize } from "./intentRules.js";

/**
 * Detect dominant SERP intent based on title patterns
 *
 * @param {string[]} titles - SERP result titles
 * @returns {{
 *   intent: string,
 *   confidence: number,
 *   breakdown: Record<string, number>
 * }}
 */
export function detectSerpIntent(titles = []) {
  if (!Array.isArray(titles) || titles.length === 0) {
    return {
      intent: "unknown",
      confidence: 0,
      breakdown: {}
    };
  }

  const normalizedTitles = titles.map(normalize);
  const totalTitles = normalizedTitles.length;

  const breakdown = {};

  for (const rule of INTENT_RULES) {
    let matchCount = 0;

    for (const title of normalizedTitles) {
      for (const pattern of rule.patterns) {
        if (title.includes(pattern)) {
          matchCount++;
          break;
        }
      }
    }

    const ratio = matchCount / totalTitles;
    breakdown[rule.intent] = Number(ratio.toFixed(2));
  }

  // pick strongest intent above threshold
  let winner = {
    intent: "informational",
    confidence: 0
  };

  for (const rule of INTENT_RULES) {
    const ratio = breakdown[rule.intent] || 0;

    if (ratio >= rule.threshold && ratio > winner.confidence) {
      winner = {
        intent: rule.intent,
        confidence: ratio
      };
    }
  }

  return {
    intent: winner.intent,
    confidence: Number(winner.confidence.toFixed(2)),
    breakdown
  };
}
