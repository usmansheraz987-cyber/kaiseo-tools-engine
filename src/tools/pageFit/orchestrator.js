// src/tools/pageFit/orchestrator.js

import { JSDOM } from "jsdom";
import { fetchPageHtml } from "../../lib/fetcher/fetchPage.js";

import runPhase1 from "./phase1/index.js";
import { runPhase2 } from "./phase2/index.js";
import runPhase3 from "./phase3/index.js";

export default async function runPageFit({
  html,
  url,
  pageUrl = null,
  phases = [1],
  primaryKeyword = null, // Phase 3 only
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

  // ---- PHASE 1 ----
  if (phases.includes(1)) {
    results.phase1 = runPhase1({
      dom,
      pageUrl: resolvedUrl,
    });
  }

  // ---- PHASE 2 ----
  if (phases.includes(2)) {
    results.phase2 = runPhase2(dom);
  }

  // ---- PHASE 3 ----
  if (phases.includes(3)) {
    if (!primaryKeyword) {
      throw new Error("Phase 3 requires a primaryKeyword");
    }

    results.phase3 = runPhase3({
      dom,
      pageUrl: resolvedUrl,
      primaryKeyword,
    });
  }

  return {
    tool: "PageFit SEO",
    executedPhases: phases,
    input: {
      htmlProvided: Boolean(html),
      urlProvided: Boolean(url),
      primaryKeywordProvided: Boolean(primaryKeyword),
    },
    fetchMeta, // safe to expose
    results,
  };
}
