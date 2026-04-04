function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

function isSemanticMatch(heading) {
  return (
    heading.includes("what") ||
    heading.includes("introduction") ||
    heading.includes("overview") ||
    heading.includes("guide") ||
    heading.includes("explained") ||
    heading.includes("basics")
  );
}

export function matchSections(expectedSections, headings) {
  const normalizedHeadings = headings.map(h => normalize(h));

  const present = [];
  const missing = [];

  for (const section of expectedSections) {
    let found = false;

    for (const heading of normalizedHeadings) {
      for (const pattern of section.patterns) {
        const p = normalize(pattern);

        if (heading.includes(p) || isSemanticMatch(heading)) {
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (found) present.push(section);
    else missing.push(section);
  }

  return { present, missing };
}