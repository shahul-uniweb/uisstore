// Firebase integration for UiS Store.
//
// Everything here is loaded LAZILY (dynamic import) and guarded to the browser,
// so the Firebase SDK never runs during SSR and is code-split out of the initial
// bundle. Firestore uses the "lite" build (write-only, no realtime listeners) to
// keep the payload small.
//
// NOTE: writes require Firestore security rules that allow `create` on the
// `leads` and `visits` collections. With the default `allow read, write: if false`
// rule every write is denied — see saveLead/logVisit warnings in the console.

import type { FirebaseApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyCuKm-l5P7ETw7SYKIUY_rHNt5SOAB5EPI",
  authDomain: "uis-store.firebaseapp.com",
  projectId: "uis-store",
  storageBucket: "uis-store.firebasestorage.app",
  messagingSenderId: "922278143766",
  appId: "1:922278143766:web:f456a74ad3453a30315237",
  measurementId: "G-ZGWZTP64XF",
};

let appPromise: Promise<FirebaseApp> | null = null;
export function ensureApp(): Promise<FirebaseApp> {
  if (!appPromise) {
    appPromise = import("firebase/app").then(({ initializeApp, getApps, getApp }) =>
      getApps().length ? getApp() : initializeApp(firebaseConfig),
    );
  }
  return appPromise;
}

export async function getDb() {
  const app = await ensureApp();
  const { getFirestore } = await import("firebase/firestore/lite");
  return getFirestore(app);
}

// ---------------------------------------------------------------------------
// Location capture
// ---------------------------------------------------------------------------

export type IpLocation = {
  ip?: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  isp?: string;
  timezone?: string;
};

// Approximate location from the visitor's IP address (no permission needed).
// Uses ipwho.is — free, HTTPS, CORS-enabled, no API key.
export async function getIpLocation(): Promise<IpLocation | null> {
  try {
    const res = await fetch("https://ipwho.is/");
    if (!res.ok) return null;
    const d = await res.json();
    if (d?.success === false) return null;
    return {
      ip: d.ip,
      city: d.city,
      region: d.region,
      country: d.country,
      countryCode: d.country_code,
      latitude: d.latitude,
      longitude: d.longitude,
      isp: d.connection?.isp,
      timezone: d.timezone?.id,
    };
  } catch {
    return null;
  }
}

export type BrowserGeo = { latitude: number; longitude: number; accuracy: number };

// Exact GPS location from the browser (requires the visitor to allow the prompt).
// Resolves null if unavailable, denied or timed out — never rejects.
export function getBrowserLocation(timeoutMs = 8000): Promise<BrowserGeo | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 0 },
    );
  });
}

// ---------------------------------------------------------------------------
// Firestore writes
// ---------------------------------------------------------------------------

export type LeadInput = {
  name: string;
  mobile: string;
  ipLocation?: IpLocation | null;
  browserGeo?: BrowserGeo | null;
};

// Saves a customer form submission to the `leads` collection.
export async function saveLead(data: LeadInput): Promise<boolean> {
  try {
    if (typeof window === "undefined") return false;
    const db = await getDb();
    const device = parseUserAgent(navigator.userAgent);
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore/lite");
    await addDoc(collection(db, "leads"), {
      name: data.name || null,
      mobile: data.mobile,
      source: detectLeadSource(document.referrer || "", location.search),
      ipLocation: data.ipLocation ?? null,
      browserGeo: data.browserGeo ?? null,
      browser: device.browser,
      os: device.os,
      device: device.device,
      userAgent: navigator.userAgent,
      language: navigator.language,
      referrer: document.referrer || null,
      page: location.pathname,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (e) {
    console.warn(
      "[firebase] saveLead failed — this is expected while the Firestore rule is `allow write: if false`. Update the rule to allow `create` on /leads to store submissions.",
      e,
    );
    return false;
  }
}

const VISITOR_ID_KEY = "uis-visitor-id"; // persistent → identifies a returning browser
const VISIT_SESSION_KEY = "uis-visit-logged"; // per-tab-session → dedupes refreshes

export type DeviceInfo = { browser: string; os: string; device: string };

// Minimal user-agent parser (no dependency). Good enough for analytics buckets.
export function parseUserAgent(ua: string): DeviceInfo {
  const s = ua.toLowerCase();

  let browser = "Other";
  if (s.includes("edg/")) browser = "Edge";
  else if (s.includes("opr/") || s.includes("opera")) browser = "Opera";
  else if (s.includes("chrome") && !s.includes("edg/")) browser = "Chrome";
  else if (s.includes("firefox")) browser = "Firefox";
  else if (s.includes("safari") && !s.includes("chrome")) browser = "Safari";
  else if (s.includes("samsungbrowser")) browser = "Samsung Internet";

  let os = "Other";
  let device = "Desktop";
  if (/iphone|ipod/.test(s)) {
    os = "iOS";
    device = "iPhone";
  } else if (s.includes("ipad")) {
    os = "iPadOS";
    device = "iPad";
  } else if (s.includes("android")) {
    os = "Android";
    device = s.includes("mobile") ? "Android Phone" : "Android Tablet";
  } else if (s.includes("windows")) {
    os = "Windows";
    device = "Windows PC";
  } else if (s.includes("mac os")) {
    os = "macOS";
    device = "Mac";
  } else if (s.includes("linux")) {
    os = "Linux";
    device = "Linux PC";
  }
  return { browser, os, device };
}

// Buckets the traffic source from the referrer + any UTM params.
export function detectSource(referrer: string, search: string): string {
  const params = new URLSearchParams(search);
  if (params.get("utm_source") || params.get("utm_campaign") || params.get("gclid") || params.get("fbclid")) {
    return "Campaign";
  }
  if (!referrer) return "Direct";
  let host = "";
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "Referral";
  }
  if (host.includes(location.hostname)) return "Direct"; // internal navigation
  if (/google\.|bing\.|yahoo\.|duckduckgo\.|ecosia\.|baidu\./.test(host)) return "Organic Search";
  if (/facebook\.|instagram\.|t\.co|twitter\.|x\.com|linkedin\.|tiktok\.|youtube\.|whatsapp/.test(host)) {
    return "Social";
  }
  return "Referral";
}

// The specific channel a LEAD came from — more granular than detectSource, so
// the sales team can see Instagram vs WhatsApp vs Google etc. "Manual" is set
// when an admin adds the lead by hand.
export const LEAD_SOURCES = [
  "Direct",
  "Google",
  "Instagram",
  "WhatsApp",
  "Facebook",
  "TikTok",
  "Twitter",
  "LinkedIn",
  "YouTube",
  "Referral",
  "Manual",
] as const;
export type LeadSource = (typeof LEAD_SOURCES)[number];

export function detectLeadSource(referrer: string, search: string): LeadSource {
  const params = new URLSearchParams(search);
  const utm = (params.get("utm_source") ?? "").toLowerCase();
  let host = "";
  try {
    host = referrer ? new URL(referrer).hostname.toLowerCase() : "";
  } catch {
    host = "";
  }
  if (host.includes(location.hostname)) host = ""; // internal navigation = treat as direct
  const hay = `${utm} ${host}`;
  if (params.get("fbclid") || /facebook|fb\./.test(hay)) return "Facebook";
  if (/instagram|ig\b/.test(hay)) return "Instagram";
  if (/whatsapp|wa\.me/.test(hay)) return "WhatsApp";
  if (/tiktok/.test(hay)) return "TikTok";
  if (/twitter|x\.com|t\.co/.test(hay)) return "Twitter";
  if (/linkedin/.test(hay)) return "LinkedIn";
  if (/youtube|youtu\.be/.test(hay)) return "YouTube";
  if (params.get("gclid") || /google|bing|yahoo|duckduckgo|ecosia|baidu/.test(hay)) return "Google";
  if (!referrer && !utm) return "Direct";
  return "Referral";
}

// Returns a stable per-browser id, creating one on first ever visit.
// The presence of a pre-existing id is what makes a visitor "returning".
function getOrCreateVisitorId(): { visitorId: string; isReturning: boolean } {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  const isReturning = !!visitorId;
  if (!visitorId) {
    visitorId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `v_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return { visitorId, isReturning };
}

// Logs one visitor record per tab-session to `visits`, capturing IP location,
// device/OS/browser, traffic source, new-vs-returning, and — if the visitor
// allows the browser prompt — their exact GPS location alongside the IP one.
//
// Skips localhost and any /admin path so dev testing and the owners' own admin
// sessions don't pollute the real visitor analytics.
export async function logVisit(): Promise<void> {
  try {
    if (typeof window === "undefined") return;

    const host = location.hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host.endsWith(".local")) return;
    if (location.pathname.startsWith("/admin")) return;

    if (sessionStorage.getItem(VISIT_SESSION_KEY)) return;
    sessionStorage.setItem(VISIT_SESSION_KEY, "1");

    const { visitorId, isReturning } = getOrCreateVisitorId();
    const device = parseUserAgent(navigator.userAgent);
    const source = detectSource(document.referrer || "", location.search);

    // Only the IP lookup is awaited (fast, ~200ms) so browser/os/device/source
    // are always captured and the write isn't blocked. Exact GPS is captured on
    // form submissions (leads), not on every visit — that keeps visit logging
    // fast and avoids prompting every visitor for location.
    const ipLocation = await getIpLocation();

    const db = await getDb();
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore/lite");
    await addDoc(collection(db, "visits"), {
      ipLocation: ipLocation ?? null,
      browserGeo: null,
      visitorId,
      isReturning,
      source,
      browser: device.browser,
      os: device.os,
      device: device.device,
      userAgent: navigator.userAgent,
      language: navigator.language,
      referrer: document.referrer || null,
      page: location.pathname,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn(
      "[firebase] logVisit failed — expected while the Firestore rule blocks writes. Allow `create` on /visits to store visitor locations.",
      e,
    );
  }
}

// ---------------------------------------------------------------------------
// Analytics (Google Analytics via Firebase — browser only)
// ---------------------------------------------------------------------------

export async function initAnalytics(): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    const app = await ensureApp();
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    if (await isSupported()) getAnalytics(app);
  } catch (e) {
    console.warn("[firebase] analytics init failed:", e);
  }
}
