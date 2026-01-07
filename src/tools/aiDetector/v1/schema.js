// src/tools/aiDetector/v1/schema.js

export const AI_DETECTOR_RESPONSE_SCHEMA = {
  ai_probability: "number (0–100)",
  classification: "Likely Human | Mixed | Likely AI",
  confidence: "low | medium | high",
  risk_level: "low | medium | high",
  signals: {
    perplexity: "low | medium | high",
    burstiness: "low | medium | high",
    repetition: "low | medium | high",
    structure: "natural | semi-patterned | patterned"
  },
  explanation: "string[]"
};
