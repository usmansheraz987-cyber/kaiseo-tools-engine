import { runSeoAnalyzerV2 } from "./service.js";
import { compareSeoResults } from "./comparison/compareResults.js";


export async function runSeoComparison({ before, after }) {
  const beforeResult = await runSeoAnalyzerV2(before);
  const afterResult = await runSeoAnalyzerV2(after);

  const comparison = compareSeoResults(
    beforeResult,
    afterResult
  );

  return {
    before: beforeResult,
    after: afterResult,
    comparison
  };
}

