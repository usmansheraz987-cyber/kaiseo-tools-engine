import { runPhase1Eligibility } from "./phases/phase1/index.js";
import { runPhase2Eligibility } from "./phases/phase2/index.js";

export function checkPageEligibility(fetchResult) {
  const phase1 = runPhase1Eligibility(fetchResult);

  // 🔒 Phase 1 hard stop
  if (phase1.canRank === "No") {
    return phase1;
  }

  // 🧠 Phase 2 only runs if Phase 1 passes
  return runPhase2Eligibility(fetchResult);
}
