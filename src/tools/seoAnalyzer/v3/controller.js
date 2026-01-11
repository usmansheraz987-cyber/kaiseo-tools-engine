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

    // run v2 internally
    const v2Result = await seoAnalyzerV2Controller(req, null, true);

    if (!v2Result.success) {
      return res.status(400).json(v2Result);
    }

    const contentSignals =
      v2Result.data.cleanContent ||
      v2Result.data.content ||
      v2Result.data.contentSignals;

    if (!contentSignals) {
      return res.status(400).json({
        success: false,
        error: "Content signals missing from v2 analysis."
      });
    }

    const { serpBenchmarks, competitors } =
      await fetchSerpData(primaryQuery);

    const relativeScore = serpContextAnalyzer({
      pageWordCount: contentSignals.cleanWordCount,
      pageHeadingCount: contentSignals.paragraphCount,
      serpBenchmarks
    });

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
