export function applyPhase2Rules(checks) {
  const failed = checks.find(c => !c.pass);

  if (failed) {
    return {
      canRank: false,
      primaryReason: `Failed: ${failed.check}`
    };
  }

  return {
    canRank: true,
    primaryReason: "Content structure valid"
  };
}
