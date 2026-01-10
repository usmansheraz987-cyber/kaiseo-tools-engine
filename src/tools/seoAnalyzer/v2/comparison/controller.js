import { runSeoComparison } from "./service.js";

export async function seoAnalyzerV2CompareController(req, res) {
  try {
    const { before, after } = req.body || {};

    if (!before || !after) {
      return res.status(400).json({
        success: false,
        error: "Both before and after inputs are required."
      });
    }

    const result = await runSeoComparison({ before, after });

    return res.status(200).json({
      success: true,
      version: "v2",
      data: result
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message || "Comparison failed."
    });
  }
}
