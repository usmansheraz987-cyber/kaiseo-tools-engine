// src/tools/pageFit/orchestrator.js

import { JSDOM } from "jsdom";
import runPhase1 from "./phase1/index.js";

export default async function runPageFit({
  html,
  pageUrl = null,
  phases = [1],
}) {
  let dom = null;

  if (html) {
    try {
      const jsdom = new JSDOM(html);
      dom = jsdom.window.document;
    } catch {
      dom = null;
    }
  }

  const results = {};

  if (phases.includes(1)) {
    results.phase1 = runPhase1({
      dom,
      pageUrl,
    });
  }

  return {
    tool: "PageFit SEO",
    executedPhases: phases,
    results,
  };
}
