function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

export function matchSections(expectedSections, headings) {
  const normalizedHeadings = headings.map(h => normalize(h));

  const present = [];
  const missing = [];

  for (const section of expectedSections) {
    const found = section.patterns.some(pattern =>
      normalizedHeadings.some(h =>
        h.includes(normalize(pattern))
      )
    );

    if (found) {
      present.push(section);
    } else {
      missing.push(section);
    }
  }

  return { present, missing };
}