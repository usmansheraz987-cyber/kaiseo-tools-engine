import { runSeoAnalyzer } from "./service.js";

export async function seoAnalyzerController(req, res) {
  try {
    const { url, html } = req.body || {};
    const eligibility = req.eligibility;

    const result = await runSeoAnalyzer({
      url,
      html
    });

    return res.status(200).json({
      success: true,
      version: "v1",
      eligibility,
      data: result
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || "SEO analysis failed."
    });
  }
}
