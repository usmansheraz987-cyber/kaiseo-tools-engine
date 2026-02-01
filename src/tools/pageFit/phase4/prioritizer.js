// src/tools/pageFit/phase4/prioritizer.js

/*
 Prioritizer
 -----------
 Orders blockers and opportunities into an execution sequence.
*/

import { PHASE3_VERDICTS } from "../schemas.js";

export default function prioritize({ blockers, opportunities, phase3 }) {
  const ordered = [];

  // ---- PHASE 3 FIRST ----
  if (
    phase3.verdict === PHASE3_VERDICTS.STRUCTURALLY_BLOCKED ||
    phase3.verdict === PHASE3_VERDICTS.DO_NOT_TARGET
  ) {
    ordered.push({
      priority: 1,
      source: "phase3",
      reason: phase3.verdict,
    });

    return ordered;
  }

  let priorityCounter = 1;

  // ---- PHASE 1 BLOCKERS ----
  blockers
    .filter(b => b.source === "phase1")
    .forEach(blocker => {
      ordered.push({
        priority: priorityCounter++,
        source: "phase1",
        type: blocker.type,
        message: blocker.message,
      });
    });

  // ---- PHASE 2 OPPORTUNITIES ----
  opportunities.forEach(op => {
    ordered.push({
      priority: priorityCounter++,
      source: op.source,
      verdict: op.verdict,
    });
  });

  return ordered;
}
