// src/tools/pageFit/phase1/links.js

import {
  SEVERITY,
  PHASE1_CHECK_TYPES,
  createIssue,
} from "../schemas.js";

/*
 This check answers:
 Does the page contain internal and external links?
*/

export default function checkLinks({ dom, pageUrl }) {
  const issues = [];

  if (!dom) {
    return issues;
  }

  const links = dom.querySelectorAll("a[href]");

  if (links.length === 0) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.LINKS,
        severity: SEVERITY.WARNING,
        message: "No links found on the page.",
      })
    );
    return issues;
  }

  let internalCount = 0;
  let externalCount = 0;

  let baseHost = null;

  try {
    if (pageUrl) {
      baseHost = new URL(pageUrl).host;
    }
  } catch {
    // ignore invalid URL
  }

  links.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
      return;
    }

    try {
      const url = baseHost
        ? new URL(href, `https://${baseHost}`)
        : new URL(href);

      if (baseHost && url.host === baseHost) {
        internalCount++;
      } else {
        externalCount++;
      }
    } catch {
      // ignore malformed URLs
    }
  });

  if (internalCount === 0) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.LINKS,
        severity: SEVERITY.WARNING,
        message: "No internal links found.",
      })
    );
  }

  if (externalCount === 0) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.LINKS,
        severity: SEVERITY.NOTE,
        message: "No external links found.",
      })
    );
  }

  return issues;
}
