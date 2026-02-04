export function buildPhase2Result(decision, checks) {
  return {
    phase: 2,
    canRank: decision.canRank,
    primaryReason: decision.primaryReason,
    checks
  };
}
