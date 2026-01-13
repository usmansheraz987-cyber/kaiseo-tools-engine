/**
 * Convert section gaps into actionable recommendations
 *
 * @param {Array} missingSections
 *
 * @returns {Array<{
 *   type: string,
 *   action: string,
 *   reason: string
 * }>}
 */
export function sectionGapsToActions(missingSections = []) {
  if (!Array.isArray(missingSections) || missingSections.length === 0) {
    return [];
  }

  return missingSections.map(section => ({
    type: "section",
    action: `Add ${section.label} section`,
    reason: `Top pages for this search intent typically include a ${section.label} section`
  }));
}
