export function cleanContent($) {
  // Remove non-content elements
  const REMOVE_SELECTORS = [
    "script",
    "style",
    "noscript",
    "iframe",
    "svg",
    "canvas",
    "nav",
    "footer",
    "aside",
    "form",
    "button",
    ".cookie",
    ".cookies",
    ".cookie-banner",
    ".consent",
    ".modal",
    ".popup"
  ];

  REMOVE_SELECTORS.forEach(selector => {
    $(selector).remove();
  });

  // Clone body to avoid mutating original DOM
  const $body = $("body").clone();

  // Remove empty nodes
  $body.find("*").each((_, el) => {
    const text = $(el).text().trim();
    if (!text && $(el).children().length === 0) {
      $(el).remove();
    }
  });

  const cleanText = $body.text().replace(/\s+/g, " ").trim();

  return {
    cleanText,
    cleanWordCount: cleanText ? cleanText.split(" ").length : 0
  };
}
