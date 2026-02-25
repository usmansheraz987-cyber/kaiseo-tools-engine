/**
 * V2 CONTROLLER
 */

import { analyzeContentV2 } from "./service.js";

export async function aiDetectorV2Controller(req, res) {
  try {
    const { text, previous_ai_probability } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Text input is required"
      });
    }

    const result = await analyzeContentV2(
      text,
      previous_ai_probability
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}