import { runSeoAnalyzerV2 } from "./service.js";
import { compareSeoResults } from "./comparison/compareResults.js";
import { checkPageEligibility } from "../../pageEligibility/index.js";

async function safeAnalyze(input) {
  try {
    const eligibility = await checkPageEligibility(input);

    if (!eligibility.eligible && eligibility.severity === "critical") {
      return {
        success: false,
        stage: "eligibility",
        eligibility
      };
    }

    const result = await runSeoAnalyzerV2(input);

    return {
      success: true,
      eligibility,
      data: result
    };

  } catch (err) {
    return {
      success: false,
      stage: "analysis",
      error: err.message || "ANALYSIS_FAILED"
    };
  }
}

export async function runSeoComparison({ before, after }) {
  const beforeRes = await safeAnalyze(before);
  const afterRes = await safeAnalyze(after);

  let comparison = null;

  if (beforeRes.success && afterRes.success) {
    comparison = compareSeoResults(
      beforeRes.data,
      afterRes.data
    );
  }

  return {
    before: beforeRes,
    after: afterRes,
    comparison
  };
}