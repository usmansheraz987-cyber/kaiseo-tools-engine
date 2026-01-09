export function analyzeTechnical({ url, html }) {
  const checks = [];

  // HTTPS CHECK (URL-aware)
  if (!url || typeof url !== "string") {
    checks.push({
      key: "https",
      title: "HTTPS enabled",
      status: "skipped",
      googleRequired: true,
      category: "indexability",
      affects: ["ranking", "crawl"],
      confidence: 0.5,
      explanation: "No URL provided. HTTPS check skipped.",
      fix: null,
      scoreImpact: 0,
    });
  } else if (url.startsWith("https://")) {
    checks.push({
      key: "https",
      title: "HTTPS enabled",
      status: "pass",
      googleRequired: true,
      category: "indexability",
      affects: ["ranking", "crawl"],
      confidence: 0.99,
      explanation: "The page is served over HTTPS.",
      fix: null,
      scoreImpact: 10,
    });
  } else {
    checks.push({
      key: "https",
      title: "HTTPS enabled",
      status: "critical",
      googleRequired: true,
      category: "indexability",
      affects: ["ranking", "crawl"],
      confidence: 0.99,
      explanation:
        "Pages served over HTTP may be considered insecure and can be demoted.",
      fix: "Serve the page over HTTPS using a valid SSL certificate.",
      scoreImpact: 10,
    });
  }

  return {
    pageSizeKb: html ? Math.round(html.length / 1024) : 0,
    checks,
  };
}
