// src/tools/pageFit/phase1/headings.js

import {
  SEVERITY,
  PHASE1_CHECK_TYPES,
  createIssue,
} from "../schemas.js";

/*
 This check answers:
 Is the heading structure logically valid?
*/

export default function checkHeadings({ dom }) {
  const issues = [];

  if (!dom) {
    return issues;
  }

  const headings = dom.querySelectorAll("h1, h2, h3, h4, h5, h6");

  if (headings.length === 0) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.HEADINGS,
        severity: SEVERITY.WARNING,
        message: "No headings found on the page.",
      })
    );
    return issues;
  }

  // ---- H1 CHECK ----
  const h1s = dom.querySelectorAll("h1");

  if (h1s.length === 0) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.HEADINGS,
        severity: SEVERITY.BLOCKER,
        message: "No H1 heading found.",
      })
    );
  } else if (h1s.length > 1) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.HEADINGS,
        severity: SEVERITY.WARNING,
        message: "Multiple H1 headings found.",
        evidence: h1s.length,
      })
    );
  }

  // ---- HEADING ORDER CHECK ----
  let lastLevel = 0;

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1), 10);

    if (lastLevel && level > lastLevel + 1) {
      issues.push(
        createIssue({
          type: PHASE1_CHECK_TYPES.HEADINGS,
          severity: SEVERITY.NOTE,
          message: `Heading order jumps from H${lastLevel} to H${level}.`,
        })
      );
    }

    lastLevel = level;
  });

  return issues;
}
