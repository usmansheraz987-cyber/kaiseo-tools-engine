/**
 * Evaluate section coverage
 *
 * @param {Object} matchResult
 * @param {Array} matchResult.present
 * @param {Array} matchResult.missing
 *
 * @returns {{
 *   missing: Array,
 *   present: Array
 * }}
 */
export function evaluateSections(matchResult = {}) {
  const present = Array.isArray(matchResult.present)
    ? matchResult.present
    : [];

  const missing = Array.isArray(matchResult.missing)
    ? matchResult.missing
    : [];

  return {
    present,
    missing
  };
}
