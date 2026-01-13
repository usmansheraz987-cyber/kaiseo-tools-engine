import robotsParser from "robots-parser";
import { fetchPage } from "../../lib/fetcher/fetchPage.js";

export async function loadRobotsRules(baseUrl) {
  try {
    const robotsUrl = new URL("/robots.txt", baseUrl).toString();
    const res = await fetchPage(robotsUrl);

    return robotsParser(robotsUrl, res.body || "");
  } catch {
    return robotsParser("", "");
  }
}
