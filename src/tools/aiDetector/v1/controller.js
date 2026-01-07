// src/tools/aiDetector/v1/controller.js

import { analyzeContent } from "./service.js";

export async function detectAIContent(req, res, next) {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text input is required" });
    }

    if (text.length < 300) {
      return res.status(400).json({
        error: "Text too short for reliable AI analysis"
      });
    }

    const result = await analyzeContent(text);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
