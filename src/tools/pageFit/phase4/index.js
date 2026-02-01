// src/tools/pageFit/phase4/index.js

import classifyFindings from "./classifier.js";
import prioritize from "./prioritizer.js";
import estimateImpact from "./impactEstimator.js";
import assessRisk from "./riskAssessor.js";
import reduceActions from "./actionReducer.js";

/*
 Phase 4 — Execution & Decision Layer
 FIX: Build actions from Phase 3 fixable signals
*/

export default function runPhase4({ phase1, phase2, phase3 }) {
  if (!phase1 || !phase2 || !phase3) {
    throw new Error("Phase 4 requires Phase 1, 2, and 3 results");
  }

  // 1) CLASSIFY (existing logic)
  const { blockers, opportunities } = classifyFindings({
    phase1,
    phase2,
    phase3,
  });

  // 2) PRIORITIZE (existing logic)
  let ordered = prioritize({
    blockers,
    opportunities,
    phase3,
  });

  // ============================
  // 🔧 FIX STARTS HERE
  // ============================

  // FORCE ACTIONS FROM PHASE 3 FIXABLE SIGNALS
  // (Phase 3 is qualified, but has problems → Phase 4 MUST act)

  const forcedActions = [];

  // --- Over-optimization ---
  if (phase3?.overOptimization?.overOptimized === true) {
    forcedActions.push({
      priority: 1,
      source: "phase3",
      type: "reduce_keyword_density",
      message: "Reduce keyword repetition and replace with semantic variants",
    });
  }

  // --- Missing summary / structural weaknesses ---
  if (
    Array.isArray(phase3?.structuralWeaknesses) &&
    phase3.structuralWeaknesses.includes("summary")
  ) {
    forcedActions.push({
      priority: 2,
      source: "phase3",
      type: "add_summary_section",
      message: "Add a concise summary section to close the page",
    });
  }

  // Merge forced actions if prioritizer returned nothing
  if (ordered.length === 0 && forcedActions.length > 0) {
    ordered = forcedActions;
  }

  // ============================
  // 🔧 FIX ENDS HERE
  // ============================

  // 3) IMPACT + RISK (existing logic)
  const withImpact = estimateImpact(ordered);
  const withRisk = assessRisk(withImpact);

  // 4) REDUCE TO 3–5 ACTIONS (existing logic)
  const actions = reduceActions(withRisk, 5);

  // 5) CONFIDENCE FIX
  const confidence =
    actions.length > 0
      ? "medium"
      : phase3.verdict === "qualified_to_rank"
      ? "high"
      : "low";

  return {
    phase: 4,
    confidence,
    actions,
  };
}
