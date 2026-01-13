import robotsParser from "robots-parser";
import { fetchPageHtml } from "../../../lib/fetcher/fetchPage.js";

/**
 * Load and parse robots.txt.
 * Always fail-safe.
 */
export async function loadRobotsRules(baseUrl) {
  try {
    const robotsUrl = new URL("/robots.txt", baseUrl).toString();

    const res = await fetchPageHtml(robotsUrl);

    return robotsParser(
      robotsUrl,
      res.html || ""
    );
  } catch {
    // If robots.txt cannot be fetched, allow crawling
    return robotsParser("", "");
  }
}
