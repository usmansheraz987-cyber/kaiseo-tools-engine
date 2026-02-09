import { JSDOM } from "jsdom";

export function extractPhase2Signals(fetchResult) {
  const signals = {
    htmlLength: 0,
    textLength: 0,
    hasTitle: false,
    hasH1: false,
    bodyTextSample: "",
    scriptCount: 0
  };

  try {
    const html = fetchResult.html || "";
    signals.htmlLength = html.length;

    const dom = new JSDOM(html);
    const document = dom.window.document;

    const bodyText = document.body?.textContent || "";
    signals.textLength = bodyText.trim().length;
    signals.bodyTextSample = bodyText.slice(0, 500);

    signals.hasTitle = !!document.querySelector("title");
    signals.hasH1 = !!document.querySelector("h1");
    signals.scriptCount = document.querySelectorAll("script").length;

  } catch (err) {
    signals.extractionError = true;
  }

  return signals;
}

