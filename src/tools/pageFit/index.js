// src/tools/pageFit/index.js

import runPageFit from "./orchestrator.js";

/*
 Public PageFit API
 This is the ONLY entry point routes should use
*/

export default {
  run: runPageFit,
};
