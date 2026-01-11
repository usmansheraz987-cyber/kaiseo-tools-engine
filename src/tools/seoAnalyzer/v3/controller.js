import { seoAnalyzerV2Controller } from "../v2/controller.js";
import { fetchSerpData } from "./service.js";
import { serpContextAnalyzer } from "./analyzer/serpContext.js";

export async function seoAnalyzerV3Controller(req, res) {
  try {
    const { primaryQuery } = req.body || {};

    if (!primaryQuery || primaryQuery.length < 3) {
      return res.status(400).json({
        success: false,
        error: "primaryQuery is required for v3 analysis."
      });
    }

    // 1️⃣ Run v2 internally
    const v2Result = await seoAnalyzerV2Controller(req, null, true);

    if (!v2Result.success) {
      return res.status(400).json(v2Result);
    }

    // 2️⃣ Extract signals from v2 result
    const contentSignals = v2Result.data.contentSignals;

    // 3️⃣ Fetch SERP benchmarks + competitors
    const { serpBenchmarks, competitors } =
      await fetchSerpData(primaryQuery);

    // 4️⃣ Compare page vs SERP
    const relativeScore = serpContextAnalyzer({
      pageWordCount: contentSignals.cleanWordCount,
      pageHeadingCount: contentSignals.headingCount,
      serpBenchmarks
    });

    // 5️⃣ Send final response
    return res.status(200).json({
      success: true,
      version: "v3",
      data: {
        ...v2Result.data,
        context: {
          query: primaryQuery,
          serpSampleSize: 10
        },
        relativeScore,
        serpBenchmarks,
        competitors
      }
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || "SEO analysis (v3) failed."
    });
  }
}
