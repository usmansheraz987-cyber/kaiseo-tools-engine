// src/tools/pageFit/phase4/impactEstimator.js

/*
 Impact Estimator
 ----------------
 Assigns relative impact to each prioritized action.
*/

export default function estimateImpact(orderedActions) {
  return orderedActions.map(action => {
    let impact = "low";

    if (action.source === "phase3") {
      impact = "high";
    }

    if (action.source === "phase1") {
      impact = "high";
    }

    if (action.source === "phase2") {
      if (action.verdict === "weak") impact = "medium";
      if (action.verdict === "average") impact = "low";
    }

    return {
      ...action,
      impact,
    };
  });
}
