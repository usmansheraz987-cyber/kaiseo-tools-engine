export function normalizeSeverity(issue) {
  if (issue.code.startsWith("HTTP") || issue.code === "NOINDEX") {
    issue.severity = "critical";
  }
  return issue;
}
