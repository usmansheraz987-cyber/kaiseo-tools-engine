export function extractPhase2Signals(fetchResult) {
  const html = typeof fetchResult.html === "string" ? fetchResult.html : "";
  const htmlText = stripTags(html);

  return {
    htmlLength: html.trim().length,
    htmlTextLength: htmlText.length,
    htmlText,

    hasHtmlContent: htmlText.length > 300,
    aboveTheFoldTextLength: extractAboveTheFoldText(html).length,
    hiddenContentDetected: detectHiddenContent(html),
    lazyLoadDetected: detectLazyLoad(html)
  };
}

function stripTags(input) {
  return input
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectHiddenContent(html) {
  return /display\s*:\s*none|visibility\s*:\s*hidden|hidden="/i.test(html);
}

function detectLazyLoad(html) {
  return /loading\s*=\s*["']lazy["']|data-src=|data-lazy=/i.test(html);
}

function extractAboveTheFoldText(html) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return "";
  return stripTags(bodyMatch[1].slice(0, 3000));
}
