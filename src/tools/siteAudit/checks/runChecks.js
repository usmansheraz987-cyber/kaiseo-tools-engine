import { checkIndexability } from "./indexability.js";
import { checkMeta } from "./meta.js";
import { checkLinks } from "./links.js";
import { checkContent } from "./content.js";
import { checkImages } from "./images.js";
import { checkPerformance } from "./performance.js";
import { checkRedirects } from "./redirects.js";
import { checkCanonicalConflicts } from "./canonical.js";

export function runChecksOnPage(page, allPages, contentHashes) {
  return [
    ...checkIndexability(page),
    ...checkMeta(page, allPages),
    ...checkLinks(page, allPages),
    ...checkContent(page, contentHashes),
    ...checkImages(page),
    ...checkPerformance(page),
    ...checkRedirects(page),
    ...checkCanonicalConflicts(page)
  ];
}
