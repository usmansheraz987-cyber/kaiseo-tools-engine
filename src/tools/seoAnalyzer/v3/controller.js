import { runSeoAnalyzerV3 } from "./service.js";

export async function seoAnalyzerV3Controller(req, res) {
  try {
    const { url, primaryQuery } = req.body || {};

    if (!url || !primaryQuery) {
      return res.status(400).json({
        success: false,
        error: "url and primaryQuery are required"
      });
    }

    const result = await runSeoAnalyzerV3({ url, primaryQuery });

    return res.status(200).json({
      success: true,
      version: "v3",
      data: result
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || "SEO analysis (v3) failed"
    });
  }
}
