import { fetchPageHtml } from "./fetchPage.js";

test("fetches valid HTML page", async () => {
  const res = await fetchPageHtml("https://example.com");
  expect(res.html).toBeTruthy();
});

test("blocks non-html content", async () => {
  await expect(
    fetchPageHtml("https://example.com/file.pdf")
  ).rejects.toThrow("NOT_HTML");
});

test("blocks private IPs", async () => {
  await expect(
    fetchPageHtml("http://127.0.0.1")
  ).rejects.toThrow("SSRF_BLOCKED");
});
