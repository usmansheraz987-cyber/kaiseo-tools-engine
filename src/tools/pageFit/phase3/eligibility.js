// src/tools/pageFit/phase3/eligibility.js

/*
 Structural eligibility checker (SEVERITY-AWARE).
 Phase 3 decides COMPETITION eligibility, not perfection.
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

/* ------------------------
   SECTION DETECTORS
-------------------------*/

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

function hasExplanation(dom) {
  const headings = dom.querySelectorAll("h2, h3");
  if (headings.length < 2) return false;

  const signals = ["what", "how", "why", "means", "work", "guide", "learn"];
  return Array.from(headings).some(h =>
    signals.some(s => h.textContent.toLowerCase().includes(s))
  );
}

function hasExamples(dom) {
  if (dom.querySelectorAll("ul, ol").length > 0) return true;

  const text = getText(dom).toLowerCase();
  return (
    text.includes("for example") ||
    text.includes("such as") ||
    text.includes("example:")
  );
}

function hasSummary(dom) {
  const headings = Array.from(dom.querySelectorAll("h2, h3"));
  if (headings.length === 0) return false;

  const last = headings[headings.length - 1].textContent.toLowerCase();
  return (
    last.includes("summary") ||
    last.includes("conclusion") ||
    last.includes("key takeaways") ||
    last.includes("final thoughts")
  );
}

/* ------------------------
   ELIGIBILITY LOGIC
-------------------------*/

export default function checkEligibility({ dom, serpModel }) {
  if (!dom) {
    return {
      eligible: false,
      reason: "no_dom",
      hardMissing: serpModel.requiredSections,
      softMissing: [],
    };
  }

  const text = getText(dom);
  const wc = wordCount(text);

  // ---- DEPTH BLOCKER ----
  if (wc < serpModel.minimumWordCount) {
    return {
      eligible: false,
      reason: "insufficient_depth",
      wordCount: wc,
      requiredMinimum: serpModel.minimumWordCount,
      hardMissing: [],
      softMissing: [],
    };
  }

  // ---- SECTION CHECKS ----
  const sectionChecks = {
    introduction: hasIntroduction(dom),
    explanation: hasExplanation(dom),
    examples: hasExamples(dom),
    summary: hasSummary(dom),
  };

  // ---- SEVERITY TIERS ----
  const HARD_SECTIONS = ["introduction", "explanation", "examples"];
  const SOFT_SECTIONS = ["summary"];

  const hardMissing = HARD_SECTIONS.filter(s => !sectionChecks[s]);
  const softMissing = SOFT_SECTIONS.filter(s => !sectionChecks[s]);

  // ---- HARD BLOCK ----
  if (hardMissing.length > 0) {
    return {
      eligible: false,
      reason: "missing_critical_sections",
      hardMissing,
      softMissing,
      sectionChecks,
    };
  }

  // ---- ELIGIBLE (WITH POSSIBLE WEAKNESSES) ----
  return {
    eligible: true,
    structuralWeaknesses: softMissing,
    sectionChecks,
    wordCount: wc,
  };
}
