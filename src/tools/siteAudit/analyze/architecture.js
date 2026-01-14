// src/tools/siteAudit/analyze/architecture.js

export function analyzeArchitecture({ depth, outgoingLinks, incomingLinks }) {
  const issues = [];

  // Excessive depth
  if (depth > 3) {
    issues.push("deep_page");
  }

  // Dead-end page (no outgoing internal links)
  if (outgoingLinks === 0) {
    issues.push("dead_end_page");
  }

  // Orphan page (no incoming internal links)
  if (incomingLinks === 0) {
    issues.push("orphan_page");
  }

  return issues;
}
