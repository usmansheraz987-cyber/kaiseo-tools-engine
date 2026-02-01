// src/tools/pageFit/phase3/verdict.js

/*
 Converts Phase 3 signals into a final verdict.
 This file contains ZERO detection logic.
*/

import { PHASE3_VERDICTS } from "../schemas.js";

export default function buildVerdict({
  intentResult,
  eligibilityResult,
  overOptimizationResult,
  serpModel,
}) {
  const reasons = [];

  // ---- STRUCTURAL BLOCK ----
  if (!eligibilityResult.eligible) {
    reasons.push({
      type: "structure",
      reason: eligibilityResult.reason,
      details: eligibilityResult,
    });

    return {
      verdict: PHASE3_VERDICTS.STRUCTURALLY_BLOCKED,
      reasons,
    };
  }

  // ---- OVER OPTIMIZATION ----
  if (overOptimizationResult.overOptimized) {
    reasons.push({
      type: "over_optimization",
      reason: overOptimizationResult.reason,
      details: overOptimizationResult,
    });

    return {
      verdict: PHASE3_VERDICTS.DO_NOT_TARGET,
      reasons,
    };
  }

  // ---- INTENT MISMATCH ----
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
    };
  }

  // ---- QUALIFIED ----
  reasons.push({
    type: "pass",
    reason: "meets_structural_and_intent_requirements",
  });

  return {
    verdict: PHASE3_VERDICTS.QUALIFIED,
    reasons,
  };
}
