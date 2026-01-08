// src/tools/seoAnalyzer/v1/suggestions.js

export function buildSuggestions(checks = []) {
  const suggestions = [];

  checks.forEach(check => {
    if (check.status === "pass") return;

    suggestions.push({
      key: check.key,
      title: check.title,
      severity: check.status, // critical | warning
      category: check.category,
      affects: check.affects,
      confidence: check.confidence,
      explanation: check.explanation,
      action: check.fix
    });
  });

  // Sort by severity first, then confidence
  suggestions.sort((a, b) => {
    if (a.severity === b.severity) {
      return b.confidence - a.confidence;
    }
    return a.severity === "critical" ? -1 : 1;
  });

  return {
    total: suggestions.length,
    critical: suggestions.filter(s => s.severity === "critical").length,
    warnings: suggestions.filter(s => s.severity === "warning").length,
    items: suggestions
  };
}
