// src/tools/pageFit/phase3/index.js

import detectIntent from "./intentDetector.js";
import { getSerpModel } from "./serpModel.js";
import checkEligibility from "./eligibility.js";
import detectOverOptimization from "./overOptimization.js";
import buildVerdict from "./verdict.js";

import { createPhase3Result } from "../schemas.js";

export default function runPhase3({
  dom,
  pageUrl = null,
  primaryKeyword,
}) {
  // ---- INTENT DETECTION ----
  const intentResult = detectIntent(primaryKeyword);

  // ---- SERP EXPECTATION MODEL ----
  const serpModel = getSerpModel(intentResult.intent);

  // ---- STRUCTURAL ELIGIBILITY ----
  const eligibilityResult = checkEligibility({
    dom,
    serpModel,
  });

  // ---- OVER OPTIMIZATION CHECK ----
  const overOptimizationResult = detectOverOptimization({
    dom,
    primaryKeyword,
  });

  // ---- FINAL VERDICT ----
  const verdictResult = buildVerdict({
    intentResult,
    eligibilityResult,
    overOptimizationResult,
    serpModel,
  });

  return createPhase3Result({
    verdict: verdictResult.verdict,
    reasons: verdictResult.reasons,
    signals: {
      intent: intentResult,
      serpModel,
      eligibility: eligibilityResult,
      overOptimization: overOptimizationResult,
    },
  });
}
