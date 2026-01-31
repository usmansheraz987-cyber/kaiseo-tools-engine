// src/tools/pageFit/phase1/images.js

import {
  SEVERITY,
  PHASE1_CHECK_TYPES,
  createIssue,
} from "../schemas.js";

/*
 This check answers:
 Are images present, and do they have alt attributes?
*/

export default function checkImages({ dom }) {
  const issues = [];

  if (!dom) {
    return issues;
  }

  const images = dom.querySelectorAll("img");

  if (images.length === 0) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.IMAGES,
        severity: SEVERITY.NOTE,
        message: "No images found on the page.",
      })
    );
    return issues;
  }

  let missingAltCount = 0;

  images.forEach((img) => {
    const alt = img.getAttribute("alt");

    if (alt === null || alt.trim() === "") {
      missingAltCount++;
    }
  });

  if (missingAltCount > 0) {
    issues.push(
      createIssue({
        type: PHASE1_CHECK_TYPES.IMAGES,
        severity:
          missingAltCount === images.length
            ? SEVERITY.WARNING
            : SEVERITY.NOTE,
        message: `${missingAltCount} image(s) are missing alt attributes.`,
        evidence: {
          totalImages: images.length,
          missingAlt: missingAltCount,
        },
      })
    );
  }

  return issues;
}
