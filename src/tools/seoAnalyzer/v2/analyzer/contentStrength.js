export function analyzeContentStrength(content) {
  const checks = [];

  // 1. Clean content length
  checks.push({
    key: "clean_content_length",
    title: "Clean content length",
    status:
      content.cleanWordCount >= 300
        ? "pass"
        : content.cleanWordCount >= 150
        ? "warning"
        : "critical",
    googleRequired: false,
    category: "content",
    affects: ["ranking"],
    confidence: 0.85,
    explanation:
      "Pages with insufficient main content often struggle to rank and satisfy users.",
    fix:
      content.cleanWordCount >= 300
        ? null
        : "Add more meaningful main content to better cover the topic.",
    scoreImpact: 6
  });

  // 2. Paragraph structure
  checks.push({
    key: "paragraph_structure",
    title: "Paragraph structure",
    status:
      content.paragraphCount >= 3
        ? "pass"
        : content.paragraphCount >= 1
        ? "warning"
        : "critical",
    googleRequired: false,
    category: "content",
    affects: ["ux", "readability"],
    confidence: 0.8,
    explanation:
      "Breaking content into paragraphs improves readability and user engagement.",
    fix:
      content.paragraphCount >= 3
        ? null
        : "Split content into clear, readable paragraphs.",
    scoreImpact: 4
  });

  // 3. Sentence readability
  checks.push({
    key: "sentence_readability",
    title: "Sentence readability",
    status:
      content.avgSentenceLength <= 25
        ? "pass"
        : content.avgSentenceLength <= 35
        ? "warning"
        : "critical",
    googleRequired: false,
    category: "content",
    affects: ["ux"],
    confidence: 0.75,
    explanation:
      "Very long sentences reduce readability and user comprehension.",
    fix:
      content.avgSentenceLength <= 25
        ? null
        : "Shorten long sentences to improve clarity and readability.",
    scoreImpact: 3
  });

  // 4. Boilerplate dominance
  checks.push({
    key: "boilerplate_ratio",
    title: "Boilerplate content dominance",
    status:
      content.boilerplateRatio <= 40
        ? "pass"
        : content.boilerplateRatio <= 60
        ? "warning"
        : "critical",
    googleRequired: false,
    category: "content",
    affects: ["ranking", "ux"],
    confidence: 0.8,
    explanation:
      "When boilerplate outweighs main content, pages provide little unique value.",
    fix:
      content.boilerplateRatio <= 40
        ? null
        : "Reduce navigation, footer, or repetitive blocks dominating the page.",
    scoreImpact: 5
  });

  return checks;
}
