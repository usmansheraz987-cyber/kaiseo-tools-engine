import { runEligibilityChecks } from "./eligibility.service.js";

export async function checkPageEligibility(input) {
  return await runEligibilityChecks(input);
}
