export function prioritizeActions({
  intent,
  missingSections
}) {
  const actions = [];

  // Intent mismatch = highest priority
  if (intent.status === "mismatch") {
    actions.push({
      priority: 1,
      action: "Fix search intent mismatch",
      reason:
        "Your page does not match what Google is ranking for this query"
    });
  }

  // Section gaps
  if (missingSections.length) {
    const highImpact = missingSections.slice(0, 3);

    actions.push({
      priority: 2,
      action: `Add key sections: ${highImpact.join(", ")}`,
      reason:
        "Top-ranking pages consistently include these sections"
    });
  }

  // Weak fallback (never empty)
  if (!actions.length) {
    actions.push({
      priority: 3,
      action: "Improve content depth",
      reason:
        "Your content lacks strong structural signals compared to competitors"
    });
  }

  return actions;
}