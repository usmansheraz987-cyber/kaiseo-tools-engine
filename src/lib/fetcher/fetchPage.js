import fetch from 'node-fetch';
import { FETCH_RULES } from './fetchRules.js';
import { protectAgainstSSRF } from "./ssrfGuard.js";



await protectAgainstSSRF(url);


export async function fetchPageHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    FETCH_RULES.timeoutMs
  );

  let response;

  try {
    response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      follow: FETCH_RULES.maxRedirects,
      signal: controller.signal,
      headers: {
        'User-Agent': FETCH_RULES.userAgent,
        'Accept': 'text/html'
      }
    });
  } catch {
    clearTimeout(timeout);
    throw new Error('TIMEOUT_OR_FETCH_FAILED');
  }

  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes(FETCH_RULES.allowedContentType)) {
    throw new Error('NOT_HTML');
  }

  const html = await response.text();

  const size = Buffer.byteLength(html, 'utf8');
  if (size > FETCH_RULES.maxSizeBytes) {
    throw new Error('HTML_TOO_LARGE');
  }

  return {
    html,
    meta: {
      httpStatus: response.status,
      finalUrl: response.url,
      pageSizeKB: Math.round(size / 1024)
    }
  };
}
