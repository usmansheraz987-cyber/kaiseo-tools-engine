import robotsParser from "robots-parser";
import { fetchPage } from "../../../lib/fetcher/fetchPage.js";

/**
 * Loads and parses robots.txt for a given base URL.
 * Always fails safely.
 */
export async function loadRobotsRules(baseUrl) {
  try {
    const robotsUrl = new URL("/robots.txt", baseUrl).toString();

    const res = await fetchPage(robotsUrl);

    return robotsParser(
      robotsUrl,
      res?.body || ""
    );
  } catch (err) {
    // Fail-safe: allow crawling if robots.txt cannot be fetched
    return robotsParser("", "");
  }
}
