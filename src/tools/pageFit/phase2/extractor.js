// src/tools/pageFit/phase2/extractor.js

/**
 * Extracts clean main content from a jsdom document
 * This is a FACT extractor, not an analyzer
 */
export function extractMainContent(document) {
  if (!document) {
    return {
      text: "",
      html: "",
      wordCount: 0,
      paragraphCount: 0
    };
  }

  // 1. Clone body so we don’t mutate original DOM
  const bodyClone = document.body.cloneNode(true);

  // 2. Remove non-content elements
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

  // 3. Prefer <main> if present
  let mainElement = bodyClone.querySelector("main");

  // Fallback: largest text container
  if (!mainElement) {
    const candidates = Array.from(bodyClone.querySelectorAll("article, section, div"));

    mainElement = candidates.reduce(
      (best, current) => {
        const textLength = current.innerText?.trim().length || 0;
        if (textLength > best.length) {
          return { element: current, length: textLength };
        }
        return best;
      },
      { element: bodyClone, length: bodyClone.innerText?.trim().length || 0 }
    ).element;
  }

  // 4. Extract paragraphs
  const paragraphs = Array.from(mainElement.querySelectorAll("p"))
    .map(p => p.innerText.trim())
    .filter(Boolean);

  const text = paragraphs.join("\n\n");
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  return {
    text,
    html: mainElement.innerHTML.trim(),
    wordCount,
    paragraphCount: paragraphs.length
  };
}
