export function applyPhase2Rules(checks) {
  const failed = checks.filter(c => c.pass === false);

  if (failed.length === 0) {
    return { canRank: "Yes", primaryReason: null };
  }

  const priority = [
    "soft404",
    "jsRequired",
    "emptyHtmlShell",
    "aboveTheFoldContent",
    "lazyLoadedContent",
    "hiddenContent",
    "boilerplateDominance",
    "renderMismatch"
  ];

  const blocker = priority.find(p =>
    failed.some(f => f.check === p)
  );

  return {
    canRank: "No",
    primaryReason: reasonMap[blocker] || "Rendered eligibility failed"
  };
}

const reasonMap = {
  soft404: "Soft 404 detected after rendering",
  jsRequired: "Main content requires JavaScript rendering",
  emptyHtmlShell: "HTML contains no meaningful content",
  aboveTheFoldContent: "No meaningful content visible above the fold",
  lazyLoadedContent: "Main content is lazy-loaded and not immediately visible",
  hiddenContent: "Main content is hidden from initial render",
  boilerplateDominance: "Rendered page is dominated by boilerplate",
  renderMismatch: "Rendered content significantly differs from HTML"
};
