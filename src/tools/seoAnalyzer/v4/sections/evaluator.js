/**
 * Evaluate section coverage with severity awareness
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
    missing,
    missingBySeverity: {
      high: missing.filter(s => s.severity === "high"),
      medium: missing.filter(s => s.severity === "medium"),
      low: missing.filter(s => s.severity === "low")
    }
  };
}
