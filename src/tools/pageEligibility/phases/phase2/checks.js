export function runPhase2Checks(signals) {
  return [
    {
      check: "jsRequired",
      pass: !(
        signals.renderUsed &&
        signals.htmlTextLength < 300 &&
        signals.visibleTextLength > 800
      )
    },
    {
      check: "emptyHtmlShell",
      pass: signals.hasHtmlContent
    },
    {
      check: "soft404",
      pass: !looksLikeSoft404(
        signals.visibleText,
        signals.visibleTextLength
      )
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
  if (!signals.renderUsed) return false;
  return signals.visibleTextLength > signals.htmlTextLength * 5;
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
  if (signals.visibleTextLength === 0) return true;
  const ratio = signals.htmlTextLength / signals.visibleTextLength;
  return ratio < 0.15;
}
