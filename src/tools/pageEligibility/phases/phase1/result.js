import { RULES } from "./rules.js";

export function buildPhase1Result(checks) {
  let blockReason = null;
  let warnReason = null;

  for (const check of checks) {
    if (!check.pass) {
      const rule = RULES[check.key];

      if (rule.severity === "block" && !blockReason) {
        blockReason = rule.message;
      }

      if (rule.severity === "warn" && !warnReason) {
        warnReason = rule.message;
      }
    }
  }

  let canRank = "Yes";
  if (blockReason) canRank = "No";
  else if (warnReason) canRank = "Partially";

  return {
    phase: 1,
    canRank,
    primaryReason: blockReason || warnReason || null,
    checks: checks.map(c => ({
      check: c.key,
      pass: c.pass
    }))
  };
}
