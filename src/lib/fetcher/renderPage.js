import puppeteer from "puppeteer";

export async function renderPage(url, timeoutMs = 15000) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      "SEOAnalyzerBot/1.0 (Rendering Enabled)"
    );

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: timeoutMs
    });

    const renderedHtml = await page.content();
    return renderedHtml;
  } finally {
    await browser.close();
  }
}
