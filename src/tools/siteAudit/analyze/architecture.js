// src/tools/siteAudit/analyze/architecture.js

export function analyzeArchitecture({ depth, outgoingLinks, incomingLinks }) {
  const issues = [];

  // Skip orphan logic for root page
  if (depth === 0) {
    if (outgoingLinks === 0) {
      issues.push("dead_end_page");
    }
    return issues;
  }

  // Excessive depth
  if (depth > 3) {
    issues.push("deep_page");
  }

  // Dead-end page
  if (outgoingLinks === 0) {
    issues.push("dead_end_page");
  }

  // True orphan (non-root only)
  if (incomingLinks === 0) {
    issues.push("orphan_page");
  }

  return issues;
}
