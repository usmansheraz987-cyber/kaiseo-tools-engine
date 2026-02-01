// src/tools/pageFit/phase2/extractor.js

/**
 * Extracts clean main content from a jsdom document
 * This is a FACT extractor, not an analyzer
 */
// src/tools/pageFit/phase2/extractor.js

/**
 * Extracts clean main content from a jsdom document
 * Defensive by design (supports fragments + full HTML)
 */
export function extractMainContent(document) {
  if (!document) {
    return emptyResult();
  }

  const body = document.body || document.documentElement;

  if (!body) {
    return emptyResult();
  }

  // Clone safely
  const bodyClone = body.cloneNode(true);

  // Remove non-content elements
  const REMOVE_SELECTORS = [
    "header",
    "footer",
    "nav",
    "aside",
    "script",
    "style",
    "noscript",
    "iframe",
    "form",
    "button"
  ];

  REMOVE_SELECTORS.forEach(selector => {
    bodyClone.querySelectorAll(selector).forEach(el => el.remove());
  });

  // Prefer <main>
  let mainElement = bodyClone.querySelector("main");

  // Fallback: largest readable container
  if (!mainElement) {
    const candidates = Array.from(
      bodyClone.querySelectorAll("article, section, div")
    );

    mainElement =
      candidates
        .map(el => ({
          el,
          length: (el.textContent || "").trim().length,
        }))
        .sort((a, b) => b.length - a.length)[0]?.el || bodyClone;
  }

  // Extract paragraphs safely
  const paragraphs = Array.from(mainElement.querySelectorAll("p"))
    .map(p => (p.textContent || "").trim())
    .filter(Boolean);

  const text = paragraphs.join("\n\n");
  const wordCount = text
    ? text.split(/\s+/).filter(Boolean).length
    : 0;

  return {
    text,
    html: mainElement.innerHTML || "",
    wordCount,
    paragraphCount: paragraphs.length,
  };
}

function emptyResult() {
  return {
    text: "",
    html: "",
    wordCount: 0,
    paragraphCount: 0,
  };
}
