export function prioritizeActions({
  intent,
  missingSections
}) {
  const actions = [];

  if (intent.status === "mismatch") {
    actions.push({
      priority: 1,
      action: `Align content with ${intent.primary} intent`,
      reason:
        "Your page does not match dominant SERP behavior"
    });
  }

  if (intent.secondary) {
    actions.push({
      priority: 2,
      action: `Also support ${intent.secondary} intent`,
      reason:
        "SERP shows mixed intent — covering both increases ranking potential"
    });
  }

  if (missingSections.length) {
    actions.push({
      priority: 3,
      action: `Add sections: ${missingSections.join(", ")}`,
      reason:
        "These sections are consistently present in top results"
    });
  }

  if (!actions.length) {
    actions.push({
      priority: 4,
      action: "Improve content depth",
      reason:
        "Content lacks strong signals compared to competitors"
    });
  }

  return actions;
}