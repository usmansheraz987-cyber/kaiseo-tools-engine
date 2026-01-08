// src/tools/seoAnalyzer/v1/analyzer.js

export function analyzeSeo(extracted) {
  const checks = [];

  const {
    meta,
    headings,
    links,
    images,
    content,
    technical
  } = extracted;

  // --------------------
  // INDEXABILITY (Google-required)
  // --------------------

  checks.push({
    key: "https",
    title: "HTTPS enabled",
    status: technical.https ? "pass" : "critical",
    googleRequired: true,
    category: "indexability",
    affects: ["ranking", "crawl"],
    confidence: 0.99,
    explanation: technical.https
      ? "The page is served over HTTPS."
      : "Pages served over HTTP may be considered insecure and can be demoted.",
    fix: technical.https
      ? null
      : "Serve the page over HTTPS using a valid SSL certificate.",
    scoreImpact: 10
  });

  checks.push({
    key: "title_tag",
    title: "Title tag present",
    status: meta.title ? "pass" : "critical",
    googleRequired: true,
    category: "indexability",
    affects: ["ranking"],
    confidence: 0.98,
    explanation: meta.title
      ? "The page has a title tag."
      : "Pages without a title tag struggle to rank and display poorly in search results.",
    fix: meta.title
      ? null
      : "Add a descriptive <title> tag to the page.",
    scoreImpact: 10
  });

  // --------------------
  // CONTENT (Performance)
  // --------------------

  checks.push({
    key: "title_length",
    title: "Title length",
    status:
      meta.titleLength >= 30 && meta.titleLength <= 60
        ? "pass"
        : "warning",
    googleRequired: false,
    category: "content",
    affects: ["ctr"],
    confidence: 0.9,
    explanation:
      "Titles that are too short or too long may reduce click-through rate.",
    fix:
      meta.titleLength >= 30 && meta.titleLength <= 60
        ? null
        : "Keep the title between 30–60 characters for optimal visibility.",
    scoreImpact: 4
  });

  checks.push({
    key: "meta_description",
    title: "Meta description present",
    status: meta.metaDescription ? "pass" : "warning",
    googleRequired: false,
    category: "content",
    affects: ["ctr"],
    confidence: 0.95,
    explanation: meta.metaDescription
      ? "The page has a meta description."
      : "Missing meta descriptions often reduce click-through rate from search results.",
    fix: meta.metaDescription
      ? null
      : "Add a concise meta description (120–160 characters).",
    scoreImpact: 4
  });

  checks.push({
    key: "h1_presence",
    title: "H1 heading present",
    status: headings.h1Count > 0 ? "pass" : "warning",
    googleRequired: false,
    category: "content",
    affects: ["ranking", "ux"],
    confidence: 0.9,
    explanation:
      "An H1 helps search engines and users understand the main topic of the page.",
    fix:
      headings.h1Count > 0
        ? null
        : "Add a clear H1 heading that reflects the page topic.",
    scoreImpact: 5
  });

  checks.push({
    key: "content_length",
    title: "Content length",
    status: content.wordCount >= 300 ? "pass" : "warning",
    googleRequired: false,
    category: "content",
    affects: ["ranking"],
    confidence: 0.85,
    explanation:
      "Very short pages often struggle to rank unless they satisfy a specific intent.",
    fix:
      content.wordCount >= 300
        ? null
        : "Expand the content to better cover the topic and user intent.",
    scoreImpact: 6
  });

  // --------------------
  // TECHNICAL (Hygiene)
  // --------------------

  checks.push({
    key: "image_alt",
    title: "Image alt attributes",
    status:
      images.totalImages === 0 || images.imagesWithoutAlt === 0
        ? "pass"
        : "warning",
    googleRequired: false,
    category: "technical",
    affects: ["ux", "image-search"],
    confidence: 0.9,
    explanation:
      "Alt attributes improve accessibility and help search engines understand images.",
    fix:
      images.imagesWithoutAlt === 0
        ? null
        : "Add descriptive alt text to images missing alt attributes.",
    scoreImpact: 3
  });

  checks.push({
    key: "internal_links",
    title: "Internal linking",
    status: links.internalLinks > 0 ? "pass" : "warning",
    googleRequired: false,
    category: "technical",
    affects: ["crawl", "ux"],
    confidence: 0.85,
    explanation:
      "Internal links help distribute link equity and guide users through the site.",
    fix:
      links.internalLinks > 0
        ? null
        : "Add internal links to related pages on your site.",
    scoreImpact: 3
  });

  return checks;
}
