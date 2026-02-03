import { extractPhase1Data } from "./extractor.js";
import { runPhase1Checks } from "./checks.js";
import { buildPhase1Result } from "./result.js";

export function runPhase1Eligibility(fetchResult) {
  const data = extractPhase1Data(fetchResult);
  const checks = runPhase1Checks(data);
  return buildPhase1Result(checks);
}
