// src/tools/seoAnalyzer/v1/schema.js

export const seoAnalyzerInputSchema = {
  type: "object",
  properties: {
    url: {
      type: "string",
      format: "uri",
      nullable: true
    },
    html: {
      type: "string",
      minLength: 1
    }
  },
  required: ["html"],
  additionalProperties: false
};

export const seoAnalyzerCheckSchema = {
  type: "object",
  properties: {
    key: { type: "string" },
    title: { type: "string" },
    status: {
      type: "string",
      enum: ["pass", "warning", "critical"]
    },
    googleRequired: { type: "boolean" },
    category: {
      type: "string",
      enum: ["indexability", "content", "technical"]
    },
    affects: {
      type: "array",
      items: { type: "string" }
    },
    confidence: { type: "number" },
    explanation: { type: "string" },
    fix: { type: ["string", "null"] },
    scoreImpact: { type: "number" }
  },
  required: [
    "key",
    "title",
    "status",
    "googleRequired",
    "category",
    "affects",
    "confidence",
    "explanation",
    "scoreImpact"
  ]
};

export const seoAnalyzerResponseSchema = {
  type: "object",
  properties: {
    extracted: { type: "object" },
    checks: {
      type: "array",
      items: seoAnalyzerCheckSchema
    },
    score: {
      type: "object",
      properties: {
        totalScore: { type: "number" },
        categoryScores: { type: "object" },
        hasCriticalIndexabilityFail: { type: "boolean" }
      },
      required: ["totalScore", "categoryScores"]
    },
    suggestions: {
      type: "object",
      properties: {
        total: { type: "number" },
        critical: { type: "number" },
        warnings: { type: "number" },
        items: { type: "array" }
      }
    }
  },
  required: ["checks", "score", "suggestions"]
};
