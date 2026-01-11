import { analyzeV2 } from "../v2/controller.js"
import { fetchSerpData } from "./service.js"
import { serpContextAnalyzer } from "./analyzer/serpContext.js"

export async function analyzeV3(req, res) {
  const { primaryQuery } = req.body

  if (!primaryQuery || primaryQuery.length < 3) {
    return res.status(400).json({
      success: false,
      code: "PRIMARY_QUERY_REQUIRED"
    })
  }

  // run v2 analysis first
  const v2Result = await analyzeV2(req, res, true)

  const contentSignals = v2Result.data.contentSignals

  const { serpBenchmarks, competitors } =
    await fetchSerpData(primaryQuery)

  const relativeScore = serpContextAnalyzer({
    pageWordCount: contentSignals.cleanWordCount,
    pageHeadingCount: contentSignals.headingCount,
    serpBenchmarks
  })

  return res.json({
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
  })
}
