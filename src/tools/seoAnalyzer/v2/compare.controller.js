import { runSeoComparison } from "./compare.service.js";

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

    // 🔥 UX-ready logic
    if (!result.before.success && !result.after.success) {
      return res.status(200).json({
        success: false,
        message: "Both pages failed to analyze.",
        data: result
      });
    }

    return res.status(200).json({
      success: true,
      version: "v2",
      data: result
    });

  } catch (err) {
    console.error("V2 Compare Fatal Error:", err);

    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}