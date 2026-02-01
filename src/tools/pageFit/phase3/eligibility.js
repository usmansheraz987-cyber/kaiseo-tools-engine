// src/tools/pageFit/phase3/eligibility.js

/*
 Structural eligibility checker (REFINED).
 Detects FUNCTIONAL sections, not literal labels.
*/

function getBody(dom) {
  return dom && dom.body ? dom.body : null;
}

function getText(dom) {
  if (!dom || !dom.body) return "";
  return dom.body.textContent || "";
}

function wordCount(text) {
  return text.trim().split(/\s+/).length;
}

/*
 INTRODUCTION:
 First meaningful text before first H2
*/
function hasIntroduction(dom) {
  const body = getBody(dom);
  if (!body) return false;

  const firstH2 = body.querySelector("h2");
  let introText = "";

  for (const node of body.childNodes) {
    if (node === firstH2) break;
    if (node.textContent) introText += node.textContent;
  }

  return wordCount(introText) >= 80;
}

/*
 EXPLANATION:
 Multiple H2/H3 sections that explain concepts
*/
function hasExplanation(dom) {
  const headings = dom.querySelectorAll("h2, h3");
  if (headings.length < 2) return false;

  const explanationSignals = [
    "what",
    "how",
    "why",
    "means",
    "work",
    "guide",
    "learn",
  ];

  let hits = 0;

  headings.forEach(h => {
    const text = h.textContent.toLowerCase();
    if (explanationSignals.some(s => text.includes(s))) {
      hits++;
    }
  });

  return hits >= 1;
}

/*
 EXAMPLES:
 Lists, step breakdowns, or explicit example phrases
*/
function hasExamples(dom) {
  const lists = dom.querySelectorAll("ul, ol");
  if (lists.length > 0) return true;

  const text = getText(dom).toLowerCase();
  return (
    text.includes("for example") ||
    text.includes("such as") ||
    text.includes("example:")
  );
}

/*
 SUMMARY:
 Ending section or takeaway-style conclusion
*/
function hasSummary(dom) {
  const headings = Array.from(dom.querySelectorAll("h2, h3"));
  if (headings.length === 0) return false;

  const lastHeading = headings[headings.length - 1].textContent.toLowerCase();

  return (
    lastHeading.includes("summary") ||
    lastHeading.includes("conclusion") ||
    lastHeading.includes("key takeaways") ||
    lastHeading.includes("final thoughts")
  );
}

export default function checkEligibility({ dom, serpModel }) {
  if (!dom) {
    return {
      eligible: false,
      reason: "no_dom",
      missingSections: serpModel.requiredSections,
    };
  }

  const text = getText(dom);
  const wc = wordCount(text);

  const sectionChecks = {
    introduction: hasIntroduction(dom),
    explanation: hasExplanation(dom),
    examples: hasExamples(dom),
    summary: hasSummary(dom),
  };

  const missingSections = serpModel.requiredSections.filter(
    s => !sectionChecks[s]
  );

  // ---- HARD BLOCK: DEPTH ----
  if (wc < serpModel.minimumWordCount) {
    return {
      eligible: false,
      reason: "insufficient_depth",
      wordCount: wc,
      requiredMinimum: serpModel.minimumWordCount,
      missingSections,
    };
  }

  // ---- HARD BLOCK: STRUCTURE ----
  if (missingSections.length > 0) {
    return {
      eligible: false,
      reason: "missing_required_sections",
      missingSections,
      sectionChecks,
    };
  }

  // ---- PASSED ----
  return {
    eligible: true,
    wordCount: wc,
    sectionChecks,
  };
}
