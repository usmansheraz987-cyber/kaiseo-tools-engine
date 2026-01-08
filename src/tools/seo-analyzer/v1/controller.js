// src/tools/seoAnalyzer/v1/controller.js

import { runSeoAnalyzer } from "./service.js";

export async function seoAnalyzerController(req, res) {
  try {
    const { url, html } = req.body || {};

    if (!html && !url) {
      return res.status(400).json({
        error: "Either HTML content or URL must be provided."
      });
    }

    // NOTE:
    // If URL fetching is added later, it happens BEFORE service call.
    // For now, html is mandatory for analysis logic.

    const result = await runSeoAnalyzer({
      url,
      html
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message || "SEO analysis failed."
    });
  }
}
