// src/tools/pageFit/phase1/meta.js

import {
  SEVERITY,
  PHASE1_CHECK_TYPES,
  createIssue,
} from "../schemas.js";

/*
 This check answers:
 Does the page have basic, sane meta information?
*/

export default function checkMeta({ dom }) {
  const issues = [];

  if (!dom) {
    return issues;
  }

  // ---- TITLE CHECK ----
  const titleTag = dom.querySelector("title");

  if (!titleTag) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.META,
        severity: SEVERITY.BLOCKER,
        message: "Title tag is missing.",
      })
    );
  } else {
    const titleText = titleTag.textContent.trim();

    if (!titleText) {
      issues.push(
        createIssue({
          type: PHASE1_CHECK_TYPES.META,
          severity: SEVERITY.BLOCKER,
          message: "Title tag exists but is empty.",
        })
      );
    } else if (titleText.length < 10) {
      issues.push(
        createIssue({
          type: PHASE1_CHECK_TYPES.META,
          severity: SEVERITY.WARNING,
          message: "Title tag is very short.",
          evidence: titleText,
        })
      );
    }
  }

  // ---- META DESCRIPTION CHECK ----
  const metaDescription = dom.querySelector(
    'meta[name="description"]'
  );

  if (!metaDescription) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.META,
        severity: SEVERITY.WARNING,
        message: "Meta description is missing.",
      })
    );
  } else {
    const descriptionText =
      metaDescription.getAttribute("content")?.trim() || "";

    if (!descriptionText) {
      issues.push(
        createIssue({
          type: PHASE1_CHECK_TYPES.META,
          severity: SEVERITY.WARNING,
          message: "Meta description exists but is empty.",
        })
      );
    } else if (descriptionText.length < 50) {
      issues.push(
        createIssue({
          type: PHASE1_CHECK_TYPES.META,
          severity: SEVERITY.NOTE,
          message: "Meta description is very short.",
          evidence: descriptionText,
        })
      );
    }
  }

  return issues;
}
