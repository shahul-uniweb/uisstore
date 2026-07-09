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

const firebaseConfig = {
  apiKey: "AIzaSyCuKm-l5P7ETw7SYKIUY_rHNt5SOAB5EPI",
  authDomain: "uis-store.firebaseapp.com",
  projectId: "uis-store",
  storageBucket: "uis-store.firebasestorage.app",
  messagingSenderId: "922278143766",
  appId: "1:922278143766:web:f456a74ad3453a30315237",
  measurementId: "G-ZGWZTP64XF",
};

let appPromise: Promise<FirebaseApp> | null = null;
function ensureApp(): Promise<FirebaseApp> {
  if (!appPromise) {
    appPromise = import("firebase/app").then(({ initializeApp, getApps, getApp }) =>
      getApps().length ? getApp() : initializeApp(firebaseConfig),
    );
  }
  return appPromise;
}

async function getDb() {
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
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore/lite");
    await addDoc(collection(db, "leads"), {
      name: data.name || null,
      mobile: data.mobile,
      ipLocation: data.ipLocation ?? null,
      browserGeo: data.browserGeo ?? null,
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

const VISIT_KEY = "uis-visit-logged";

// Logs one visitor record (IP-based location) per browser session to `visits`.
export async function logVisit(): Promise<void> {
  try {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(VISIT_KEY)) return;
    sessionStorage.setItem(VISIT_KEY, "1");

    const ipLocation = await getIpLocation();
    const db = await getDb();
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore/lite");
    await addDoc(collection(db, "visits"), {
      ipLocation: ipLocation ?? null,
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
