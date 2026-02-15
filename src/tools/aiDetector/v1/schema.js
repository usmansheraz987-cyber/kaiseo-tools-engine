export const AI_DETECTOR_RESPONSE_SCHEMA = {
  ai_probability: "number (0–100)",
  classification: "Likely Human | Mixed | Likely AI",
  confidence: "low | medium | high",
  risk_level: "low | medium | high",

  sentence_analysis: [
    {
      index: "number",
      text: "string",
      ai_probability: "number",
      signals: {
        repetition: "low | medium | high",
        structure: "natural | semi-patterned | patterned",
        transitions: "low | medium | high"
      },
      flags: ["string"]
    }
  ],

  paragraph_analysis: [
    {
      index: "number",
      text: "string",
      ai_probability: "number",
      dominant_signal: "string | null"
    }
  ]
};
