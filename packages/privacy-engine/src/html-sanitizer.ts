// ============================================================================
// TRACKING-PIXEL PROTECTION & PRIVACY PROXY ENGINE (Sec. 12, FR-C6.1, FR-C6.2)
// ============================================================================

export interface SanitizedEmailView {
  sanitizedHtml: string;
  trackersDetected: number;
  blockedDomains: string[];
  proxiedAssetCount: number;
}

const KNOWN_TRACKER_PATTERNS = [
  /open\.convertkit-mail/i,
  /list-manage\.com\/track\/open/i,
  /sendgrid\.net\/wf\/open/i,
  /hubspotlinks\.com/i,
  /pixel\.watch/i,
  /width=["']?1["']?\s+height=["']?1["']?/i,
];

export function inspectAndSanitizeHtml(rawHtml: string, proxyBaseUrl = '/api/v1/privacy-proxy'): SanitizedEmailView {
  let trackersDetected = 0;
  let proxiedAssetCount = 0;
  const blockedDomains = new Set<string>();

  const sanitizedHtml = rawHtml.replace(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi, (match, srcUrl: string) => {
    const isTracker = KNOWN_TRACKER_PATTERNS.some((pattern) => pattern.test(match) || pattern.test(srcUrl));
    if (isTracker) {
      trackersDetected += 1;
      try {
        blockedDomains.add(new URL(srcUrl).hostname);
      } catch {
        blockedDomains.add('tracker-pixel.local');
      }
      return '<!-- [MailCare Privacy Shield: 1x1 Tracking Pixel Stripped] -->';
    }
    proxiedAssetCount += 1;
    const encoded = encodeURIComponent(srcUrl);
    return match.replace(srcUrl, `${proxyBaseUrl}?asset=${encoded}`);
  });

  return {
    sanitizedHtml,
    trackersDetected,
    blockedDomains: Array.from(blockedDomains),
    proxiedAssetCount,
  };
}
