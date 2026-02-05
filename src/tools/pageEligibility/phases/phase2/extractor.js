export function extractPhase2Signals(fetchResult) {
  const html = fetchResult.html || "";
  const rendered = fetchResult.renderedHtml || null;

  // 👁️ What Google actually sees
  const visibleDom = rendered || html;

  const htmlText = stripTags(html);
  const visibleText = stripTags(visibleDom);

  return {
    // Raw lengths
    htmlLength: html.trim().length,
    renderedLength: rendered ? rendered.trim().length : 0,

    // Text lengths
    htmlTextLength: htmlText.length,
    visibleTextLength: visibleText.length,

    // Text bodies
    htmlText,
    visibleText,

    // Content presence
    hasHtmlContent: htmlText.length > 300,
    hasVisibleContent: visibleText.length > 500,

    // Visibility signals (render-aware)
    hiddenContentDetected: detectHiddenContent(visibleDom),
    lazyLoadDetected: detectLazyLoad(visibleDom),
    aboveTheFoldTextLength: extractAboveTheFoldText(visibleDom).length,

    // Render status
    renderUsed: Boolean(rendered)
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

function detectHiddenContent(dom) {
  return /display\s*:\s*none|visibility\s*:\s*hidden|hidden="/i.test(dom);
}

function detectLazyLoad(dom) {
  return /loading\s*=\s*["']lazy["']|data-src=|data-lazy=/i.test(dom);
}

function extractAboveTheFoldText(dom) {
  const bodyMatch = dom.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) return "";
  return stripTags(bodyMatch[1].slice(0, 3000));
}
