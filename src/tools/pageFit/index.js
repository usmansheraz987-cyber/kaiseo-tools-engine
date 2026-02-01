// src/tools/pageFit/index.js

import runPageFit from "./orchestrator.js";

/*
 Public PageFit API
 This is the ONLY entry point routes should use
*/

export default {
  run: ({
    html,
    url,
    pageUrl,
    phases = [1],
    primaryKeyword = null, // Phase 3 only
  }) => {
    return runPageFit({
      html,
      url,
      pageUrl,
      phases,
      primaryKeyword,
    });
  },
};
