/**
 * V2 RESPONSE SCHEMA
 */

export function formatResponse(data) {
  return {
    ai_probability: data.ai_probability,
    classification: data.classification,
    confidence: data.confidence,
    risk_level: data.risk_level,

    signal_breakdown: data.signal_breakdown,

    sentence_analysis: data.sentence_analysis,
    paragraph_analysis: data.paragraph_analysis,

    style_analysis: data.style_analysis,
    structure_analysis: data.structure_analysis,
    repetition_analysis: data.repetition_analysis,

    rewrite_suggestions: data.rewrite_suggestions,
    impact_estimate: data.impact_estimate,

    meta: data.meta
  };
}