// Meta Pixel helper: fires only if a pixel (fbq) is installed on the page.
// Also preserves UTM / fbclid params from the ad click into the CTA link.
declare global {
  interface Window { fbq?: (...a: unknown[]) => void }
}
export function track(event: string, data?: Record<string, unknown>, custom = false) {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq(custom ? "trackCustom" : "track", event, data);
}
export function ctaUrl(base: string) {
  if (typeof window === "undefined") return base;
  const src = new URLSearchParams(window.location.search);
  const u = new URL(base);
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"].forEach((k) => {
    const v = src.get(k);
    if (v) u.searchParams.set(k, v);
  });
  if (!u.searchParams.get("utm_source")) u.searchParams.set("utm_source", "build-your-plate");
  return u.toString();
}
