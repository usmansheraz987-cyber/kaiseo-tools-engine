// src/tools/pageFit/phase3/eligibility.js

/*
 Determines if a page is structurally eligible
 to rank for a keyword intent.
*/

function getTextContent(dom) {
  if (!dom || !dom.body) return "";
  return dom.body.textContent || "";
}

function getWordCount(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

function detectSections(dom) {
  if (!dom) return [];

  const headings = Array.from(
    dom.querySelectorAll("h1, h2, h3")
  ).map(h => h.textContent.toLowerCase().trim());

  const sections = [];

  for (const h of headings) {
    if (h.includes("intro")) sections.push("introduction");
    if (h.includes("what") || h.includes("how")) sections.push("explanation");
    if (h.includes("example")) sections.push("examples");
    if (h.includes("summary") || h.includes("conclusion")) sections.push("summary");

    if (h.includes("pros") || h.includes("cons")) sections.push("pros_cons");
    if (h.includes("vs") || h.includes("comparison")) sections.push("comparison_table_or_lists");
    if (h.includes("verdict") || h.includes("final")) sections.push("verdict");

    if (h.includes("price") || h.includes("pricing")) sections.push("pricing_or_offer");
    if (h.includes("feature")) sections.push("features");
    if (h.includes("buy") || h.includes("get started") || h.includes("sign up"))
      sections.push("call_to_action");
  }

  return Array.from(new Set(sections));
}

export default function checkEligibility({
  dom,
  serpModel,
}) {
  if (!dom) {
    return {
      eligible: false,
      reason: "no_dom",
      missingSections: serpModel.requiredSections,
    };
  }

  const text = getTextContent(dom);
  const wordCount = getWordCount(text);
  const detectedSections = detectSections(dom);

  const missingSections = serpModel.requiredSections.filter(
    section => !detectedSections.includes(section)
  );

  // ---- HARD BLOCKS ----
  if (wordCount < serpModel.minimumWordCount) {
    return {
      eligible: false,
      reason: "insufficient_depth",
      wordCount,
      requiredMinimum: serpModel.minimumWordCount,
      missingSections,
    };
  }

  if (missingSections.length > 0) {
    return {
      eligible: false,
      reason: "missing_required_sections",
      missingSections,
    };
  }

  // ---- PASSED ----
  return {
    eligible: true,
    wordCount,
    detectedSections,
  };
}
