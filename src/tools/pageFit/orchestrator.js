// src/tools/pageFit/orchestrator.js



import { JSDOM } from "jsdom";
import { fetchPageHtml } from "../../lib/fetcher/fetchPage.js";
import runPhase1 from "./phase1/index.js";

export default async function runPageFit({
  html,
  url,
  pageUrl = null,
  phases = [1],
}) {
  let finalHtml = html || null;
  let fetchMeta = null;
  let resolvedUrl = pageUrl || url || null;

  // ---- FETCH HTML IF URL PROVIDED ----
  if (!finalHtml && url) {
    const fetched = await fetchPageHtml(url);
    finalHtml = fetched.html;
    fetchMeta = fetched.meta;
  }

  let dom = null;

  if (finalHtml) {
    try {
      const jsdom = new JSDOM(finalHtml);
      dom = jsdom.window.document;
    } catch {
      dom = null;
    }
  }

  const results = {};

  if (phases.includes(1)) {
    results.phase1 = runPhase1({
      dom,
      pageUrl: resolvedUrl,
    });
  }

  return {
    tool: "PageFit SEO",
    executedPhases: phases,
    input: {
      htmlProvided: Boolean(html),
      urlProvided: Boolean(url),
    },
    fetchMeta, // safe to expose, no secrets
    results,
  };
}

