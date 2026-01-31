// src/tools/pageFit/phase1/indexability.js

import {
  SEVERITY,
  PHASE1_CHECK_TYPES,
  createIssue,
} from "../schemas.js";

/*
 This check answers ONE question:
 Can search engines index this page or not?
*/

export default function checkIndexability({ dom }) {
  const issues = [];

  if (!dom) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.INDEXABILITY,
        severity: SEVERITY.BLOCKER,
        message: "HTML could not be parsed. Page is not analyzable.",
      })
    );

    return issues;
  }

  // ---- META ROBOTS CHECK ----
  const robotsMeta = dom.querySelector('meta[name="robots"]');
  if (robotsMeta) {
    const content = robotsMeta.getAttribute("content")?.toLowerCase() || "";

    if (content.includes("noindex")) {
      issues.push(
        createIssue({
          type: PHASE1_CHECK_TYPES.INDEXABILITY,
          severity: SEVERITY.BLOCKER,
          message: "Page is marked as noindex via meta robots.",
          evidence: content,
        })
      );
    }
  }

  // ---- CANONICAL CHECK ----
  const canonical = dom.querySelector('link[rel="canonical"]');
  if (!canonical) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.INDEXABILITY,
        severity: SEVERITY.WARNING,
        message: "Canonical tag is missing.",
      })
    );
  } else {
    const href = canonical.getAttribute("href");
    if (!href) {
      issues.push(
        createIssue({
          type: PHASE1_CHECK_TYPES.INDEXABILITY,
          severity: SEVERITY.WARNING,
          message: "Canonical tag exists but has no URL.",
        })
      );
    }
  }

  return issues;
}
