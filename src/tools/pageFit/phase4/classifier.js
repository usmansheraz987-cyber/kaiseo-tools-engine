// src/tools/pageFit/phase4/classifier.js

/*
 Classifier
 ----------
 Splits findings into:
 - blockers: must fix before anything else
 - opportunities: improvements that can wait
*/

import { SEVERITY, PHASE3_VERDICTS } from "../schemas.js";

export default function classifyFindings({ phase1, phase2, phase3 }) {
  const blockers = [];
  const opportunities = [];

  // ---- PHASE 3 HARD BLOCKERS ----
  if (
    phase3.verdict === PHASE3_VERDICTS.STRUCTURALLY_BLOCKED ||
    phase3.verdict === PHASE3_VERDICTS.DO_NOT_TARGET
  ) {
    blockers.push({
      source: "phase3",
      reason: phase3.verdict,
      details: phase3.reasons || [],
    });

    return { blockers, opportunities };
  }

  // ---- PHASE 1 BLOCKERS ----
  if (phase1?.issues?.length) {
    phase1.issues.forEach(issue => {
      if (issue.severity === SEVERITY.BLOCKER) {
        blockers.push({
          source: "phase1",
          type: issue.type,
          message: issue.message,
          evidence: issue.evidence || null,
        });
      }
    });
  }

  // ---- PHASE 2 SIGNALS (OPPORTUNITIES ONLY) ----
  if (phase2?.verdict && phase2.verdict !== "strong") {
    opportunities.push({
      source: "phase2",
      verdict: phase2.verdict,
    });
  }

  return { blockers, opportunities };
}
