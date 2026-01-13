import { runSiteAudit } from "./service.js";

export async function runSiteAuditController(req, res) {
  try {
    const { url, sitemap, maxPages } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: "URL_REQUIRED"
      });
    }

    const result = await runSiteAudit({
      url,
      sitemap,
      maxPages
    });

    return res.json({
      success: true,
      tool: "site-audit",
      data: result
    });

  } catch (err) {
    console.error("[SITE_AUDIT_CONTROLLER]", err);

    return res.status(500).json({
      success: false,
      error: "SITE_AUDIT_FAILED"
    });
  }
}
