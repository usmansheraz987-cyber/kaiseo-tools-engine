export function analyzeHeadings(document) {
  const headings = {
    h1: [...document.querySelectorAll("h1")].map((h) => h.textContent.trim()),
    h2: [...document.querySelectorAll("h2")].map((h) => h.textContent.trim()),
    h3: [],
    h4: [],
    h5: [],
    h6: [],
  };

  const h1Count = headings.h1.length;
  const checks = [];

  if (h1Count === 0) {
    checks.push({
      key: "h1_presence",
      title: "H1 heading present",
      status: "warning",
      googleRequired: false,
      category: "content",
      affects: ["ranking", "ux"],
      confidence: 0.9,
      explanation:
        "An H1 helps search engines and users understand the main topic of the page.",
      fix: "Add a clear H1 heading that reflects the page topic.",
      scoreImpact: 5,
    });
  } else if (h1Count > 1) {
    checks.push({
      key: "h1_presence",
      title: "Multiple H1 headings",
      status: "warning",
      googleRequired: false,
      category: "content",
      affects: ["ranking", "ux"],
      confidence: 0.85,
      explanation:
        "Multiple H1 headings can confuse search engines about the main topic.",
      fix: "Use only one H1 and move others to H2 or below.",
      scoreImpact: 5,
    });
  } else {
    checks.push({
      key: "h1_presence",
      title: "H1 heading present",
      status: "pass",
      googleRequired: false,
      category: "content",
      affects: ["ranking", "ux"],
      confidence: 0.9,
      explanation:
        "An H1 helps search engines and users understand the main topic of the page.",
      fix: null,
      scoreImpact: 5,
    });
  }

  return {
    h1Count,
    h2Count: headings.h2.length,
    structure: headings,
    checks,
  };
}
