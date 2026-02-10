import { runSeoComparison } from "./compare.service.js";


export async function seoAnalyzerV2CompareController(req, res) {
  try {
    const { before, after } = req.body;

    if (!before || !after) {
      return res.status(400).json({
        success: false,
        error: "Provide both 'before' and 'after' objects"
      });
    }

    const result = await runSeoComparison({ before, after });

    return res.json({
      success: true,
      version: "v2",
      data: result
    });

  } catch (error) {
    console.error("V2 Compare Controller Error:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}
