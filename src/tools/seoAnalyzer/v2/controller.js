import { runSeoAnalyzerV2 } from "./service.js";

export async function seoAnalyzerV2Controller(req, res) {
  try {
    const { html, url } = req.body || {};

    if (!html && !url) {
      return res.status(400).json({
        success: false,
        error: "Either HTML content or URL must be provided."
      });
    }

    const result = await runSeoAnalyzerV2({ html, url });

    return res.status(200).json({
      success: true,
      version: "v2",
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || "SEO analysis (v2) failed."
    });
  }
}
