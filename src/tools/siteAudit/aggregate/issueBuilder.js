// src/tools/siteAudit/aggregate/issueBuilder.js

import { ISSUE_SEVERITY } from "../score/weights.js";

export function buildIssues(issueList) {
  const result = {
    critical: {},
    high: {},
    medium: {},
    low: {}
  };

  issueList.forEach(issue => {
    const severity = ISSUE_SEVERITY[issue];
    if (!severity) return;

    if (!result[severity][issue]) {
      result[severity][issue] = 1;
    } else {
      result[severity][issue]++;
    }
  });

  return result;
}
