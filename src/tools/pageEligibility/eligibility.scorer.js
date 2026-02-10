export function calculateVerdict(issues) {
  const hasCritical = issues.some(i => i.severity === "critical");
  const hasWarnings = issues.some(i => i.severity === "warning");

  if (hasCritical) {
    return {
      eligible: false,
      severity: "critical",
      verdict: "Page is not eligible for advanced analysis"
    };
  }

  if (hasWarnings) {
    return {
      eligible: true,
      severity: "warning",
      verdict: "Page eligible with structural weaknesses"
    };
  }

  return {
    eligible: true,
    severity: "clean",
    verdict: "Page is fully eligible"
  };
}
