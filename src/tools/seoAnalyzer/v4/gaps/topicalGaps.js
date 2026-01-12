import { SECTION_PATTERNS } from "./sectionPatterns.js";

/**
 * Detect topical / structural gaps
 *
 * @param {string[]} serpTitles
 * @param {string[]} pageHeadings
 * @returns {{
 *   missing: string[],
 *   weak: string[],
 *   present: string[]
 * }}
 */
export function detectTopicalGaps(serpTitles = [], pageHeadings = []) {
  const titles = serpTitles.map(t => t.toLowerCase());
  const headings = pageHeadings.map(h => h.toLowerCase());

  const missing = [];
  const weak = [];
  const present = [];

  for (const section of SECTION_PATTERNS) {
    const serpHits = titles.filter(t =>
      section.patterns.some(p => t.includes(p))
    ).length;

    const pageHits = headings.filter(h =>
      section.patterns.some(p => h.includes(p))
    ).length;

    if (serpHits > 0 && pageHits === 0) {
      missing.push(section.label);
    } else if (serpHits > 0 && pageHits > 0) {
      present.push(section.label);
    } else if (pageHits > 0 && serpHits === 0) {
      weak.push(section.label);
    }
  }

  return {
    missing,
    weak,
    present
  };
}
