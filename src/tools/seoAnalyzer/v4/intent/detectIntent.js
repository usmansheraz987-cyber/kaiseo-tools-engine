function normalize(text) {
  return (text || "").toLowerCase();
}

function scoreTitle(title) {
  let informational = 0;
  let comparison = 0;
  let transactional = 0;

  if (
    title.includes("what") ||
    title.includes("guide") ||
    title.includes("how") ||
    title.includes("learn") ||
    title.includes("explained")
  ) {
    informational++;
  }

  if (
    title.includes("best") ||
    title.includes("top") ||
    title.includes("vs") ||
    title.includes("compare") ||
    title.includes("review")
  ) {
    comparison++;
  }

  if (
    title.includes("buy") ||
    title.includes("price") ||
    title.includes("pricing") ||
    title.includes("plan") ||
    title.includes("hosting") ||
    title.includes("service") ||
    title.includes("provider")
  ) {
    transactional++;
  }

  // brand boost
  if (
    title.includes("godaddy") ||
    title.includes("namecheap") ||
    title.includes("wix") ||
    title.includes("hostinger")
  ) {
    transactional += 2;
  }

  return { informational, comparison, transactional };
}

export function detectSerpIntent(titles = []) {
  if (!titles.length) {
    return {
      primary: "informational",
      secondary: null,
      distribution: {
        informational: 1,
        comparison: 0,
        transactional: 0
      },
      confidence: 0.4
    };
  }

  let totals = {
    informational: 0,
    comparison: 0,
    transactional: 0
  };

  for (const t of titles) {
    const score = scoreTitle(normalize(t));

    totals.informational += score.informational;
    totals.comparison += score.comparison;
    totals.transactional += score.transactional;
  }

  const sorted = Object.entries(totals).sort(
    (a, b) => b[1] - a[1]
  );

  const primary = sorted[0][0];
  const secondary = sorted[1][1] > 0 ? sorted[1][0] : null;

  const totalScore =
    totals.informational +
    totals.comparison +
    totals.transactional;

  const confidence = totalScore
    ? sorted[0][1] / totalScore
    : 0.4;

  return {
    primary,
    secondary,
    distribution: totals,
    confidence
  };
}