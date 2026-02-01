import { classifyActions } from "./classifier.js";
import { prioritizeActions } from "./prioritizer.js";
import riskAssessor from "./riskAssessor.js"; // ✅ FIXED
import { estimateImpact } from "./impactEstimator.js";
import { reduceActions } from "./actionReducer.js";

export default function runPhase4({ results }) {
  const actions = [];
  const phase3 = results?.phase3;

  if (!phase3) {
    return {
      phase: 4,
      confidence: "low",
      actions: []
    };
  }

  // Over-optimization → action
  if (phase3?.overOptimization?.overOptimized === true) {
    actions.push({
      type: "reduce_keyword_density",
      source: "phase3",
      priority: 1,
      reason: "keyword_density_too_high"
    });
  }

  // Missing summary → action
  if (
    Array.isArray(phase3?.structuralWeaknesses) &&
    phase3.structuralWeaknesses.includes("summary")
  ) {
    actions.push({
      type: "add_summary_section",
      source: "phase3",
      priority: 2,
      reason: "missing_summary_section"
    });
  }

  const classified = classifyActions(actions);
  const prioritized = prioritizeActions(classified);
  const withRisk = riskAssessor(prioritized); // ✅ FIXED
  const withImpact = estimateImpact(withRisk);
  const finalActions = reduceActions(withImpact);

  return {
    phase: 4,
    confidence: finalActions.length ? "high" : "low",
    actions: finalActions
  };
}
