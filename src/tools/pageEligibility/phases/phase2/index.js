export function runPhase2Eligibility(fetchResult) {
  const signals = extractPhase2Signals(fetchResult);
  const checks = runPhase2Checks(signals);
  const decision = applyPhase2Rules(checks);
  return buildPhase2Result(decision, checks);
}
