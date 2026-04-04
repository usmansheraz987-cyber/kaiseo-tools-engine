function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

/* ---------- CONTENT SIGNAL MATCH ---------- */

function contentIncludes(text, keywords) {
  return keywords.some(k => text.includes(k));
}

/* ---------- MAIN ---------- */

export function matchSections(expectedSections, headings, pageText = "") {
  const normalizedHeadings = headings.map(h => normalize(h));
  const normalizedText = normalize(pageText);

  const present = [];
  const missing = [];

  for (const section of expectedSections) {
    let found = false;

    // 🔹 1. Check headings
    for (const heading of normalizedHeadings) {
      if (
        section.patterns.some(p =>
          heading.includes(normalize(p))
        )
      ) {
        found = true;
        break;
      }
    }

    // 🔹 2. Check page content (NEW)
    if (!found) {
      if (contentIncludes(normalizedText, section.patterns)) {
        found = true;
      }
    }

    if (found) present.push(section);
    else missing.push(section);
  }

  return { present, missing };
}