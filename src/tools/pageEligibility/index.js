import { runPhase1Eligibility } from "./phases/phase1/index.js";

export function checkPageEligibility(fetchResult) {
  return runPhase1Eligibility(fetchResult);
}
