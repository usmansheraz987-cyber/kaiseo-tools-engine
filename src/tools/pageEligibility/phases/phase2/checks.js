export function runPhase2Checks(signals) {
  return [
    {
      check: "jsRequired",
      pass: !(signals.htmlTextLength < 300 && signals.renderedTextLength > 800)
    },
    {
      check: "emptyHtmlShell",
      pass: signals.hasHtmlContent
    },
    {
      check: "soft404",
      pass: !looksLikeSoft404(signals.renderedText, signals.renderedTextLength)
    },
    {
      check: "renderMismatch",
      pass: !isLargeMismatch(signals)
    },
    {
      check: "lazyLoadedContent",
      pass: !signals.lazyLoadDetected || signals.hasHtmlContent
    },
    {
      check: "hiddenContent",
      pass: !signals.hiddenContentDetected
    },
    {
      check: "aboveTheFoldContent",
      pass: signals.aboveTheFoldTextLength > 200
    },
    {
      check: "boilerplateDominance",
      pass: !isBoilerplateDominant(signals)
    }
  ];
}

function isLargeMismatch(signals) {
  return signals.renderedTextLength > signals.htmlTextLength * 5;
}

function looksLikeSoft404(text, length) {
  const patterns = [
    "no results found",
    "nothing found",
    "page not found",
    "try another search",
    "no content available"
  ];

  if (length < 300) return true;

  return patterns.some(p => text.toLowerCase().includes(p));
}

function isBoilerplateDominant(signals) {
  if (signals.renderedTextLength === 0) return true;
  const ratio = signals.htmlTextLength / signals.renderedTextLength;
  return ratio < 0.15;
}
