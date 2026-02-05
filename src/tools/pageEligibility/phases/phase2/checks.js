export function runPhase2Checks(signals) {
  return [
    {
      check: "emptyHtmlShell",
      pass: signals.hasHtmlContent
    },
    {
      check: "soft404",
      pass: !looksLikeSoft404(signals.htmlText, signals.htmlTextLength)
    },
    {
      check: "lazyLoadedContent",
      pass: !signals.lazyLoadDetected
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
  if (signals.htmlTextLength === 0) return true;
  return signals.htmlTextLength / signals.htmlLength < 0.15;
}
