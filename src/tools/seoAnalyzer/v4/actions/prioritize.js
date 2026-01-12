import { WEIGHTS } from "../constants/weights.js";

/**
 * Build a prioritized action list
 *
 * @param {object} signals
 * @param {object} signals.intent
 * @param {string[]} signals.missingSections
 * @param {string[]} signals.weakSections
 * @param {boolean} signals.hasCriticalTechnicalIssues
 *
 * @returns {Array<{
 *   priority: number,
 *   action: string,
 *   reason: string
 * }>}
 */
export function prioritizeActions(signals) {
  const actions = [];
  let priority = 1;

  // 1. Intent mismatch beats everything
  if (signals.intent?.status === "mismatch") {
    actions.push({
      priority: priority++,
      action: "Align page with dominant search intent",
      reason: "Top ranking pages target a different intent than this page"
    });
  }

  // 2. Missing structural sections
  if (signals.missingSections?.length > 0) {
    actions.push({
      priority: priority++,
      action: "Add missing high-expectation sections",
      reason: `Top results consistently include: ${signals.missingSections.join(
        ", "
      )}`
    });
  }

  // 3. Weak but unnecessary sections
  if (signals.weakSections?.length > 0) {
    actions.push({
      priority: priority++,
      action: "Evaluate low-impact sections",
      reason: `These sections appear on your page but not in top results: ${signals.weakSections.join(
        ", "
      )}`
    });
  }

  // 4. Technical blockers (from v1)
  if (signals.hasCriticalTechnicalIssues) {
    actions.push({
      priority: priority++,
      action: "Fix critical technical SEO issues",
      reason: "Search engines may not properly index or trust this page"
    });
  }

  return actions.slice(0, WEIGHTS.MAX_ACTIONS);
}
