export function extractPhase2Signals(fetchResult) {
  const html = fetchResult.html || "";
  const rendered = fetchResult.renderedHtml || "";

  const htmlText = stripTags(html);
  const renderedText = stripTags(rendered);

  return {
    htmlLength: html.trim().length,
    renderedLength: rendered.trim().length,

    htmlTextLength: htmlText.length,
    renderedTextLength: renderedText.length,

    htmlText,
    renderedText,

    hasHtmlContent: htmlText.length > 300,
    hasRenderedContent: renderedText.length > 500,

    hiddenContentDetected: detectHiddenContent(rendered),
    lazyLoadDetected: detectLazyLoad(rendered),
    aboveTheFoldTextLength: extractAboveTheFoldText(rendered).length
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

function detectHiddenContent(renderedHtml) {
  return /display\s*:\s*none|visibility\s*:\s*hidden|hidden="/i.test(renderedHtml);
}

function detectLazyLoad(renderedHtml) {
  return /loading\s*=\s*["']lazy["']|data-src=|data-lazy=/i.test(renderedHtml);
}

function extractAboveTheFoldText(renderedHtml) {
  const bodyMatch = renderedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return "";

  // crude but deterministic: first ~3000 chars
  return stripTags(bodyMatch[1].slice(0, 3000));
}
