// src/tools/pageFit/phase2/index.js

import { extractMainContent } from "./extractor.js";
import { analyzeParagraphStructure } from "./structure.js";
import { analyzeReadability } from "./readability.js";
import { analyzeContentDepth } from "./depth.js";
import { analyzeRedundancy } from "./redundancy.js";

/**
 * Runs Phase 2 — Content Strength & Quality
 */
export function runPhase2(document) {
  // 1. Extract main content
  const extractor = extractMainContent(document);

  // 2. Structural signals
  const structure = analyzeParagraphStructure(extractor);

  // 3. Readability signals
  const readability = analyzeReadability(extractor);

  // 4. Depth signals
  const depth = analyzeContentDepth(extractor);

  // 5. Redundancy signals
  const redundancy = analyzeRedundancy(extractor);

  // 6. Verdict logic (simple, explainable)
  let verdict = "average";

  if (
    extractor.wordCount < 300 ||
    readability.hardToRead ||
    depth.thinContent ||
    redundancy.fluffDetected
  ) {
    verdict = "weak";
  }

  if (
    extractor.wordCount > 800 &&
    !readability.hardToRead &&
    depth.depthSignal === "high" &&
    !redundancy.fluffDetected
  ) {
    verdict = "strong";
  }

  return {
    phase: 2,
    verdict,
    signals: {
      extractor,
      structure,
      readability,
      depth,
      redundancy
    }
  };
}
