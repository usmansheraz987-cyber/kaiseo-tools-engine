export function prioritizeActions({
  intent,
  missingSections
}) {
  const actions = [];

  // Intent mismatch = highest priority
  if (intent.status === "mismatch") {
    actions.push({
      priority: 1,
      action: "Rewrite page to match search intent",
      reason:
        "Google ranks a different type of content for this query"
    });
  }

  // Section gaps
  if (missingSections.length) {
    actions.push({
      priority: 2,
      action: `Add sections: ${missingSections.join(", ")}`,
      reason:
        "These sections improve clarity and align with top-ranking pages"
    });
  }

  // Never return empty
  if (!actions.length) {
    actions.push({
      priority: 3,
      action: "Improve content depth",
      reason:
        "Content lacks strong structural and informational signals"
    });
  }

  return actions;
}