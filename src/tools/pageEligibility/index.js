import { runPhase1Eligibility } from "./phases/phase1/index.js";

export function checkPageEligibility(pageData) {
  return runPhase1Eligibility(pageData);
}
