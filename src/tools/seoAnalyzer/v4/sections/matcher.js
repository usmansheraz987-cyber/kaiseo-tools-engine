function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

/* ---------- MATCHERS ---------- */

function matchesComparison(heading) {
  return (
    heading.includes("compare") ||
    heading.includes("vs") ||
    heading.includes("versus") ||
    heading.includes("best") ||
    heading.includes("top") ||
    heading.includes("review") ||
    heading.includes("comparison")
  );
}

function matchesPricing(heading) {
  return (
    heading.includes("price") ||
    heading.includes("pricing") ||
    heading.includes("cost") ||
    heading.includes("plans")
  );
}

function matchesProsCons(heading) {
  return (
    heading.includes("pros") ||
    heading.includes("cons") ||
    heading.includes("advantages") ||
    heading.includes("disadvantages")
  );
}

function matchesAlternatives(heading) {
  return (
    heading.includes("alternative") ||
    heading.includes("competitor") ||
    heading.includes("similar")
  );
}

/* ---------- MAIN ---------- */

export function matchSections(expectedSections, headings) {
  const normalizedHeadings = headings.map(h => normalize(h));

  const present = [];
  const missing = [];

  for (const section of expectedSections) {
    let found = false;

    for (const heading of normalizedHeadings) {
      switch (section.key) {
        case "comparison_table":
          if (matchesComparison(heading)) found = true;
          break;

        case "pricing":
          if (matchesPricing(heading)) found = true;
          break;

        case "pros_cons":
          if (matchesProsCons(heading)) found = true;
          break;

        case "alternatives":
          if (matchesAlternatives(heading)) found = true;
          break;

        default:
          if (
            section.patterns.some(p =>
              heading.includes(normalize(p))
            )
          ) {
            found = true;
          }
      }

      if (found) break;
    }

    if (found) present.push(section);
    else missing.push(section);
  }

  return { present, missing };
}