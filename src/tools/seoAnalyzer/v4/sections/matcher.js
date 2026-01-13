/**
 * Normalize text for safe matching
 */
function normalize(text = "") {
  return text.toLowerCase().trim();
}

/**
 * Match expected sections against page headings
 *
 * @param {Array} expectedSections - from rules.js
 * @param {Array<string>} pageHeadings - extracted h1–h6 text
 *
 * @returns {{
 *   present: Array,
 *   missing: Array
 * }}
 */
export function matchSections(expectedSections = [], pageHeadings = []) {
  const normalizedHeadings = pageHeadings.map(normalize);

  const present = [];
  const missing = [];

  for (const section of expectedSections) {
    const found = normalizedHeadings.some(heading =>
      section.patterns.some(pattern =>
        heading.includes(normalize(pattern))
      )
    );

    if (found) {
      present.push(section);
    } else {
      missing.push(section);
    }
  }

  return {
    present,
    missing
  };
}
