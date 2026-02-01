// src/tools/pageFit/phase3/verdict.js

/*
 Phase 3 Verdict Engine (ELIGIBILITY ONLY)
 No fixable penalties live here.
*/

import { PHASE3_VERDICTS } from "../schemas.js";

export default function buildVerdict({
  intentResult,
  eligibilityResult,
  serpModel,
}) {
  const reasons = [];

  /* ------------------------
     HARD STRUCTURAL BLOCK
  -------------------------*/
  if (!eligibilityResult.eligible) {
    reasons.push({
      type: "structure",
      reason: eligibilityResult.reason,
      hardMissing: eligibilityResult.hardMissing || [],
      softMissing: eligibilityResult.softMissing || [],
    });

    return {
      verdict: PHASE3_VERDICTS.STRUCTURALLY_BLOCKED,
      reasons,
      structuralWeaknesses: [],
    };
  }

  /* ------------------------
     INTENT MISMATCH
  -------------------------*/
  if (
    serpModel.allowedPageRoles &&
    !serpModel.allowedPageRoles.includes("pillar") &&
    intentResult.intent === "informational"
  ) {
    reasons.push({
      type: "intent",
      reason: "page_role_not_supported_for_intent",
      intent: intentResult.intent,
      allowedRoles: serpModel.allowedPageRoles,
    });

    return {
      verdict: PHASE3_VERDICTS.INTENT_MISMATCH,
      reasons,
      structuralWeaknesses: [],
    };
  }

  /* ------------------------
     QUALIFIED (WITH WEAKNESSES)
  -------------------------*/
  if (
    eligibilityResult.structuralWeaknesses &&
    eligibilityResult.structuralWeaknesses.length > 0
  ) {
    reasons.push({
      type: "structure",
      reason: "non_blocking_structural_weaknesses",
      weaknesses: eligibilityResult.structuralWeaknesses,
    });
  }

  reasons.push({
    type: "pass",
    reason: "meets_competitive_requirements",
  });

  return {
    verdict: PHASE3_VERDICTS.QUALIFIED,
    reasons,
    structuralWeaknesses: eligibilityResult.structuralWeaknesses || [],
  };
}
