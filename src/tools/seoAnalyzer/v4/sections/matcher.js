function normalize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim();
}

function matchesDefinition(heading) {
  return (
    heading.includes("what is") ||
    heading.includes("introduction") ||
    heading.includes("overview") ||
    heading.includes("explained") ||
    heading.includes("meaning")
  );
}

function matchesExamples(heading) {
  return (
    heading.includes("example") ||
    heading.includes("use case") ||
    heading.includes("case study")
  );
}

function matchesHowItWorks(heading) {
  return (
    heading.includes("how it works") ||
    heading.includes("how it work") ||
    heading.includes("process") ||
    heading.includes("workflow")
  );
}

function matchesFAQ(heading) {
  return (
    heading.includes("faq") ||
    heading.includes("questions") ||
    heading.includes("q&a")
  );
}

export function matchSections(expectedSections, headings) {
  const normalizedHeadings = headings.map(h => normalize(h));

  const present = [];
  const missing = [];

  for (const section of expectedSections) {
    let found = false;

    for (const heading of normalizedHeadings) {
      switch (section.key) {
        case "definition":
          if (matchesDefinition(heading)) found = true;
          break;

        case "examples":
          if (matchesExamples(heading)) found = true;
          break;

        case "how_it_works":
          if (matchesHowItWorks(heading)) found = true;
          break;

        case "faq":
          if (matchesFAQ(heading)) found = true;
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