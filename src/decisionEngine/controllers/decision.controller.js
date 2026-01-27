// src/decisionEngine/controllers/decision.controller.js

const { validateDecisionInput } = require("../validators/decision.input.validator");

async function decideSeoAction(req, res) {
  const validation = validateDecisionInput(req.body);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.error,
    });
  }

  const { pageUrl, primaryQuery } = req.body;

  // TEMP RESPONSE (REAL LOGIC COMES NEXT)
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

module.exports = {
  decideSeoAction,
};
