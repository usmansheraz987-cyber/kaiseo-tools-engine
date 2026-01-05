// tools/readability/v1/controller.js

import { analyzeReadability } from "./service.js";

export function readabilityController(req, res, next) {
  try {
    const { text, preset } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Text is required and must be a string"
      });
    }

    const result = analyzeReadability(text, preset);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
