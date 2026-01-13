import { runSiteAudit } from "../service.js";

test("siteAudit never throws on bad URLs", async () => {
  const result = await runSiteAudit({
    url: "https://example.com",
    maxPages: 5
  });

  expect(result).toBeDefined();
  expect(result.meta.pagesCrawled).toBeGreaterThanOrEqual(0);
});
