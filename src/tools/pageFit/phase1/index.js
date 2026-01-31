// src/tools/pageFit/phase1/index.js

import checkIndexability from "./indexability.js";
import checkMeta from "./meta.js";
import checkHeadings from "./headings.js";
import checkImages from "./images.js";
import checkLinks from "./links.js";
import checkContentLength from "./contentLength.js";

import { createPhase1Result } from "../schemas.js";

/*
 Phase 1 runner
 Combines all Phase 1 checks into a single result
*/

export default function runPhase1({ dom, pageUrl }) {
  const issues = [];

  issues.push(...checkIndexability({ dom }));
  issues.push(...checkMeta({ dom }));
  issues.push(...checkHeadings({ dom }));
  issues.push(...checkImages({ dom }));
  issues.push(...checkLinks({ dom, pageUrl }));
  issues.push(...checkContentLength({ dom }));

  const stats = {
    checksRun: 6,
  };

  return createPhase1Result({ issues, stats });
}
