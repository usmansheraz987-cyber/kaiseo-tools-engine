// src/tools/pageFit/phase1/contentLength.js

import {
  SEVERITY,
  PHASE1_CHECK_TYPES,
  createIssue,
} from "../schemas.js";

/*
 This check answers:
 Is there a minimum amount of readable text on the page?
*/

export default function checkContentLength({ dom }) {
  const issues = [];

  if (!dom) {
    return issues;
  }

  // Get visible text content
  const bodyText = dom.body?.textContent || "";
  const cleanedText = bodyText.replace(/\s+/g, " ").trim();

  if (!cleanedText) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.CONTENT_LENGTH,
        severity: SEVERITY.BLOCKER,
        message: "Page contains no readable text content.",
      })
    );
    return issues;
  }

  const wordCount = cleanedText.split(" ").length;

  if (wordCount < 150) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.CONTENT_LENGTH,
        severity: SEVERITY.WARNING,
        message: "Page content is very thin.",
        evidence: {
          wordCount,
        },
      })
    );
  }

  return issues;
}
