// src/tools/pageFit/schemas.js

export const SEVERITY = {
  BLOCKER: "blocker",
  WARNING: "warning",
  NOTE: "note",
};

export const PHASE1_CHECK_TYPES = {
  INDEXABILITY: "indexability",
  META: "meta",
  HEADINGS: "headings",
  IMAGES: "images",
  LINKS: "links",
  CONTENT_LENGTH: "content_length",
};

/*
 A single issue format.
 Every Phase 1 check MUST return issues in this shape.
*/
export function createIssue({
  type,
  severity,
  message,
  evidence = null,
}) {
  return {
    type,
    severity,
    message,
    evidence,
  };
}

/*
 Phase 1 final output shape
*/
export function createPhase1Result({ issues, stats }) {
  return {
    phase: 1,
    valid: !issues.some(i => i.severity === SEVERITY.BLOCKER),
    issueCount: issues.length,
    issues,
    stats,
  };
}
// ---- PHASE 3 VERDICTS (LOCKED) ----
export const PHASE3_VERDICTS = {
  QUALIFIED: "qualified_to_rank",
  STRUCTURALLY_BLOCKED: "structurally_blocked",
  INTENT_MISMATCH: "intent_mismatch",
  DO_NOT_TARGET: "do_not_target",
};

/*
 Phase 3 final output shape
*/
export function createPhase3Result({
  verdict,
  reasons = [],
  signals = {},
}) {
  return {
    phase: 3,
    verdict,
    reasons,
    signals,
  };
}
