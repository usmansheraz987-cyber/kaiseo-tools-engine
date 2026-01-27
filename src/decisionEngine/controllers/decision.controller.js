// src/decisionEngine/controllers/decision.controller.js

export async function decideSeoAction(req, res) {
  const { pageUrl, primaryQuery } = req.body || {};

  if (!pageUrl || !primaryQuery) {
    return res.status(400).json({
      success: false,
      error: "pageUrl and primaryQuery are required",
    });
  }

  return res.json({
    success: true,
    data: {
      pageUrl,
      primaryQuery,
      decision: "Intent mismatch detected. Fix page intent first.",
      confidence: "medium",
    },
  });
}
