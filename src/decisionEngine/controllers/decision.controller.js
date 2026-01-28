import { runDecisionEngine } from "../decision.engine.js";

export async function decideSeoAction(req, res) {
  const { pageUrl, primaryQuery } = req.body || {};

  if (!pageUrl || !primaryQuery) {
    return res.status(400).json({
      success: false,
      error: "pageUrl and primaryQuery are required",
    });
  }

  const result = await runDecisionEngine({ pageUrl, primaryQuery });

  return res.json({
    success: true,
    data: result,
  });
}
