// Admin panel: auth, role/permission model, and Firestore data access.
//
// Browser-only, lazily loaded (same pattern as lib/firebase.ts) so none of this
// — or the Firebase Auth SDK — ships in the public marketing site's bundle.
//
// PERMISSION MODEL
// - Two email addresses are permanently "superadmin", hardcoded below. They
//   always have every menu, regardless of what's stored in Firestore — this is
//   a safety net so a bad Firestore write can never lock the owners out.
// - Every other admin user has a `permissions: string[]` array (menu keys) that
//   is set when they're created and editable afterwards. Their `role` field is
//   a display label, not what grants access — access is purely the permissions
//   array (plus the superadmin override above).
// - Firestore security rules must mirror this (see docs/FIRESTORE-RULES.md) —
//   the UI hiding a menu is not a security boundary on its own.

import { ensureApp, getDb } from "./firebase";

// Re-export lead-source helpers so admin UIs import everything from one place.
export { LEAD_SOURCES, type LeadSource } from "./firebase";

export const SUPER_ADMIN_EMAILS = ["shahul@uniwebonline.com", "aneeshbabu@uniwebonline.com"] as const;

export function isSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return (SUPER_ADMIN_EMAILS as readonly string[]).includes(email.toLowerCase());
}

// Permanent display names for the two fixed super admins, used to self-provision
// their profile on first login without needing anyone to type it in.
const SUPER_ADMIN_NAMES: Record<string, string> = {
  "shahul@uniwebonline.com": "Shahul",
  "aneeshbabu@uniwebonline.com": "Aneesh Babu",
};

export type MenuKey = "dashboard" | "visits" | "forms" | "search-console" | "users";

export const MENU_ITEMS: { key: MenuKey; label: string; path: string }[] = [
  { key: "dashboard", label: "Dashboard", path: "/admin" },
  { key: "visits", label: "Visits & Map", path: "/admin/visits" },
  { key: "forms", label: "Forms", path: "/admin/forms" },
  { key: "search-console", label: "Search Console", path: "/admin/search-console" },
  { key: "users", label: "Users", path: "/admin/users" },
];

const ALL_MENU_KEYS: MenuKey[] = MENU_ITEMS.map((m) => m.key);

export type AdminProfile = {
  uid: string;
  email: string;
  name: string;
  role: string;
  permissions: MenuKey[];
  active: boolean;
  createdAt?: unknown;
  createdBy?: string | null;
};

export function hasPermission(profile: AdminProfile | null, key: MenuKey): boolean {
  if (!profile) return false;
  if (isSuperAdminEmail(profile.email)) return true;
  return profile.active && profile.permissions.includes(key);
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

async function getAuthInstance() {
  const app = await ensureApp();
  const { getAuth } = await import("firebase/auth");
  return getAuth(app);
}

export async function signInAdmin(email: string, password: string): Promise<void> {
  const auth = await getAuthInstance();
  const { signInWithEmailAndPassword } = await import("firebase/auth");
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOutAdmin(): Promise<void> {
  const auth = await getAuthInstance();
  const { signOut } = await import("firebase/auth");
  await signOut(auth);
}

export async function sendAdminPasswordReset(email: string): Promise<void> {
  const auth = await getAuthInstance();
  const { sendPasswordResetEmail } = await import("firebase/auth");
  await sendPasswordResetEmail(auth, email);
}

// One-time self-service account creation, restricted to the two permanent
// super admins. Firebase Auth accounts can't be created from the Firebase
// console API without the Admin SDK, so without this, someone would have to
// manually add the first two accounts in the Firebase console before anyone
// could ever sign in. This lets shahul@/aneeshbabu@uniwebonline.com set their
// own password the first time, in-app. It only ever works for those two
// addresses — anyone else gets a clear rejection, not an open sign-up.
export async function bootstrapSuperAdmin(email: string, password: string): Promise<void> {
  if (!isSuperAdminEmail(email)) {
    throw new Error("Only the permanent super admin accounts can self-register.");
  }
  const auth = await getAuthInstance();
  const { createUserWithEmailAndPassword } = await import("firebase/auth");
  await createUserWithEmailAndPassword(auth, email, password);
  // onAuthStateChanged (wired in watchAdminAuth) picks this up and
  // auto-provisions the Firestore profile via ensureUserProfile.
}

// Subscribes to Firebase Auth state. Returns an unsubscribe function.
// Fires `onChange(null)` when signed out, `onChange(profile)` once the matching
// Firestore profile has been loaded (auto-provisioning it for the two fixed
// super admins the first time they ever sign in).
export function watchAdminAuth(onChange: (profile: AdminProfile | null) => void): () => void {
  let unsub = () => {};
  let cancelled = false;

  (async () => {
    const auth = await getAuthInstance();
    const { onAuthStateChanged } = await import("firebase/auth");
    unsub = onAuthStateChanged(auth, async (user) => {
      if (cancelled) return;
      if (!user || !user.email) {
        onChange(null);
        return;
      }
      try {
        const profile = await ensureUserProfile(user.uid, user.email);
        if (!cancelled) onChange(profile);
      } catch (e) {
        console.warn("[admin] failed to load profile — check Firestore rules allow reading /users:", e);
        if (!cancelled) onChange(null);
      }
    });
  })();

  return () => {
    cancelled = true;
    unsub();
  };
}

// Determines a signed-in user's access. Authentication itself is Firebase
// Auth only (this runs after sign-in already succeeded); Firestore is used
// only to look up display info (name/role) and, for non-fixed users, their
// permissions array.
//
// The two permanent super admins are a hardcoded bypass: their access is
// ALWAYS full, regardless of what (if anything) exists in Firestore for
// them — a missing/misread /users doc can never lock them out. Their
// Firestore /users/{uid} document is optional and, per the "initial stage"
// setup, created manually by you in the Firebase console (see
// ADMIN-PANEL.md) rather than auto-written by the app — so this function
// never writes to Firestore, only reads.
async function ensureUserProfile(uid: string, email: string): Promise<AdminProfile> {
  const superAdmin = isSuperAdminEmail(email);
  let stored: {
    name?: string;
    role?: string;
    permissions?: unknown;
    active?: boolean;
  } | null = null;

  try {
    const db = await getDb();
    const { doc, getDoc } = await import("firebase/firestore/lite");
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) stored = snap.data();
  } catch (e) {
    console.warn("[admin] couldn't read /users profile (check Firestore rules allow reading it):", e);
  }

  if (superAdmin) {
    return {
      uid,
      email,
      name: stored?.name ?? SUPER_ADMIN_NAMES[email.toLowerCase()] ?? email,
      role: stored?.role ?? "Super Admin",
      permissions: ALL_MENU_KEYS, // Firestore data never restricts a fixed super admin.
      active: true,
    };
  }

  if (!stored) {
    // No Firestore profile (or it couldn't be read) and not a fixed super
    // admin — no access until a super admin creates their profile via Users.
    return { uid, email, name: email, role: "Unassigned", permissions: [], active: false };
  }

  return {
    uid,
    email,
    name: stored.name ?? email,
    role: stored.role ?? "Admin",
    permissions: Array.isArray(stored.permissions) ? (stored.permissions as MenuKey[]) : [],
    active: stored.active !== false,
  };
}

// ---------------------------------------------------------------------------
// User management (superadmin only — enforced both here and by Firestore rules)
// ---------------------------------------------------------------------------

export type NewAdminUser = {
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: MenuKey[];
  createdBy: string;
};

// Creates a Firebase Auth account (with the password the super admin sets) plus
// a Firestore profile for a new admin user — without disturbing the currently
// signed-in admin's session. Uses a throwaway secondary Firebase App instance
// (the standard client-side workaround; there's no server-side Admin SDK here).
export async function createAdminUser(input: NewAdminUser): Promise<void> {
  const { initializeApp, deleteApp } = await import("firebase/app");
  const { getAuth, createUserWithEmailAndPassword, signOut } = await import("firebase/auth");

  const secondaryApp = initializeApp(firebaseConfigFallback(), `admin-create-${Date.now()}`);
  try {
    const secondaryAuth = getAuth(secondaryApp);
    const cred = await createUserWithEmailAndPassword(secondaryAuth, input.email, input.password);

    const db = await getDb();
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore/lite");
    await setDoc(doc(db, "users", cred.user.uid), {
      name: input.name,
      email: input.email,
      role: input.role,
      permissions: input.permissions,
      active: true,
      createdAt: serverTimestamp(),
      createdBy: input.createdBy,
    });

    await signOut(secondaryAuth);
  } finally {
    await deleteApp(secondaryApp);
  }
}

// Removes a user's Firestore profile (revoking all panel access). Note: the
// Firebase Auth account itself can only be deleted with the Admin SDK server-
// side; without a profile the account can still authenticate but lands on the
// "not authorized" screen, so this effectively disables them.
export async function deleteAdminUser(uid: string): Promise<void> {
  const db = await getDb();
  const { doc, deleteDoc } = await import("firebase/firestore/lite");
  await deleteDoc(doc(db, "users", uid));
}

// firebase.ts's config isn't exported as a plain object import-cycle-safely for
// the secondary app, so re-declare the (public, non-secret) client config here.
function firebaseConfigFallback() {
  return {
    apiKey: "AIzaSyCuKm-l5P7ETw7SYKIUY_rHNt5SOAB5EPI",
    authDomain: "uis-store.firebaseapp.com",
    projectId: "uis-store",
    storageBucket: "uis-store.firebasestorage.app",
    messagingSenderId: "922278143766",
    appId: "1:922278143766:web:f456a74ad3453a30315237",
  };
}

export async function fetchAllUsers(): Promise<AdminProfile[]> {
  const db = await getDb();
  const { collection, getDocs, orderBy, query } = await import("firebase/firestore/lite");
  const snap = await getDocs(query(collection(db, "users"), orderBy("createdAt", "desc")));
  const users = snap.docs.map((d) => {
    const v = d.data();
    return {
      uid: d.id,
      email: v.email,
      name: v.name ?? v.email,
      role: v.role ?? "Admin",
      permissions: Array.isArray(v.permissions) ? v.permissions : [],
      active: v.active !== false,
      createdAt: v.createdAt,
      createdBy: v.createdBy ?? null,
    } as AdminProfile;
  });
  return withSuperAdmins(users);
}

// Ensures both permanent super admins always appear in the users list, even if
// their Firestore /users document was never created — shown as synthetic,
// non-editable entries in that case.
function withSuperAdmins(users: AdminProfile[]): AdminProfile[] {
  const present = new Set(users.map((u) => u.email.toLowerCase()));
  const synthetic: AdminProfile[] = [];
  for (const email of SUPER_ADMIN_EMAILS) {
    if (!present.has(email)) {
      synthetic.push({
        uid: `super:${email}`,
        email,
        name: SUPER_ADMIN_NAMES[email] ?? email,
        role: "Super Admin",
        permissions: ALL_MENU_KEYS,
        active: true,
      });
    }
  }
  return [...synthetic, ...users];
}

export async function updateAdminUser(
  uid: string,
  data: Partial<Pick<AdminProfile, "name" | "role" | "permissions" | "active">>,
): Promise<void> {
  const db = await getDb();
  const { doc, updateDoc } = await import("firebase/firestore/lite");
  await updateDoc(doc(db, "users", uid), data);
}

// ---------------------------------------------------------------------------
// Visits & leads (read side, for the dashboard/visits/forms menus)
// ---------------------------------------------------------------------------

type GeoPoint = { latitude: number; longitude: number; accuracy: number };

export type VisitRecord = {
  id: string;
  ipLocation: {
    ip?: string;
    city?: string;
    region?: string;
    country?: string;
    countryCode?: string;
    latitude?: number;
    longitude?: number;
    isp?: string;
  } | null;
  browserGeo: GeoPoint | null;
  visitorId?: string;
  isReturning?: boolean;
  source?: string;
  browser?: string;
  os?: string;
  device?: string;
  userAgent?: string;
  language?: string;
  referrer?: string | null;
  page?: string;
  createdAt: Date | null;
};

export const LEAD_STATUSES = ["New", "Contacted", "Interested", "Converted", "Lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_PACKAGES = ["Starter", "Basic", "Advanced", "Premium", "Custom", "Undecided"] as const;
export type LeadPackage = (typeof LEAD_PACKAGES)[number];

// Editable CRM fields a sales admin can fill in on a lead after it comes in.
export type LeadCrmFields = {
  customerName?: string; // editable display name (defaults to the submitted name)
  mobile2?: string; // secondary phone
  email1?: string;
  email2?: string;
  address?: string;
  mapLink?: string; // pasted Google Maps link
  packageInterest?: LeadPackage;
  status?: LeadStatus;
  source?: import("./firebase").LeadSource; // channel: Instagram/WhatsApp/Google/Manual/…
};

export type LeadRecord = LeadCrmFields & {
  id: string;
  name: string | null; // original submitted name (immutable)
  mobile: string;
  ipLocation: VisitRecord["ipLocation"];
  browserGeo: GeoPoint | null;
  browser?: string;
  os?: string;
  device?: string;
  userAgent?: string;
  language?: string;
  referrer?: string | null;
  page?: string;
  createdAt: Date | null;
};

function tsToDate(v: unknown): Date | null {
  if (v && typeof v === "object" && "toDate" in v && typeof (v as { toDate: unknown }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate();
  }
  return null;
}

// A date window used to limit how much Firestore data is read. `since`/`until`
// are optional; omitting both reads everything (up to `max`).
export type DateRange = { since?: Date; until?: Date };

async function rangeConstraints(range?: DateRange) {
  const { where, Timestamp } = await import("firebase/firestore/lite");
  const cons = [];
  if (range?.since) cons.push(where("createdAt", ">=", Timestamp.fromDate(range.since)));
  if (range?.until) cons.push(where("createdAt", "<=", Timestamp.fromDate(range.until)));
  return cons;
}

export async function fetchVisits(max = 2000, range?: DateRange): Promise<VisitRecord[]> {
  const db = await getDb();
  const { collection, getDocs, orderBy, query, limit } = await import("firebase/firestore/lite");
  const cons = await rangeConstraints(range);
  const snap = await getDocs(query(collection(db, "visits"), ...cons, orderBy("createdAt", "desc"), limit(max)));
  return snap.docs.map((d) => {
    const v = d.data();
    return {
      id: d.id,
      ipLocation: v.ipLocation ?? null,
      browserGeo: v.browserGeo ?? null,
      visitorId: v.visitorId,
      isReturning: v.isReturning === true,
      source: v.source,
      browser: v.browser,
      os: v.os,
      device: v.device,
      userAgent: v.userAgent,
      language: v.language,
      referrer: v.referrer ?? null,
      page: v.page,
      createdAt: tsToDate(v.createdAt),
    };
  });
}

export async function fetchLeads(max = 2000, range?: DateRange): Promise<LeadRecord[]> {
  const db = await getDb();
  const { collection, getDocs, orderBy, query, limit } = await import("firebase/firestore/lite");
  const cons = await rangeConstraints(range);
  const snap = await getDocs(query(collection(db, "leads"), ...cons, orderBy("createdAt", "desc"), limit(max)));
  return snap.docs.map((d) => {
    const v = d.data();
    return {
      id: d.id,
      name: v.name ?? null,
      mobile: v.mobile,
      // CRM fields (editable by admins)
      customerName: v.customerName ?? undefined,
      mobile2: v.mobile2 ?? undefined,
      email1: v.email1 ?? undefined,
      email2: v.email2 ?? undefined,
      address: v.address ?? undefined,
      mapLink: v.mapLink ?? undefined,
      packageInterest: v.packageInterest ?? undefined,
      status: v.status ?? undefined,
      source: v.source ?? undefined,
      ipLocation: v.ipLocation ?? null,
      browserGeo: v.browserGeo ?? null,
      browser: v.browser,
      os: v.os,
      device: v.device,
      userAgent: v.userAgent,
      language: v.language,
      referrer: v.referrer ?? null,
      page: v.page,
      createdAt: tsToDate(v.createdAt),
    };
  });
}

// Saves admin-edited CRM fields onto a lead document. Only defined keys are
// written, so blank inputs don't clobber existing values with undefined.
export async function updateLead(id: string, fields: LeadCrmFields): Promise<void> {
  const db = await getDb();
  const { doc, updateDoc } = await import("firebase/firestore/lite");
  const clean: Record<string, unknown> = {};
  for (const [k, val] of Object.entries(fields)) {
    if (val !== undefined) clean[k] = val;
  }
  await updateDoc(doc(db, "leads", id), clean);
}

// Creates a lead by hand from the admin panel. Defaults source to "Manual"
// unless the admin picked a specific channel (e.g. they got the lead via a
// WhatsApp DM). Written to the same `leads` collection as public submissions.
export async function createLeadManually(
  input: LeadCrmFields & { name: string; mobile: string },
): Promise<void> {
  const db = await getDb();
  const { collection, addDoc, serverTimestamp } = await import("firebase/firestore/lite");
  const clean: Record<string, unknown> = {};
  for (const [k, val] of Object.entries(input)) {
    if (val !== undefined && val !== "") clean[k] = val;
  }
  await addDoc(collection(db, "leads"), {
    ...clean,
    name: input.name || null,
    mobile: input.mobile,
    source: input.source ?? "Manual",
    manual: true,
    createdAt: serverTimestamp(),
  });
}

// Small analytics helper shared by the dashboard and visits pages.
export type VisitAnalytics = {
  total: number;
  unique: number;
  newVisitors: number;
  returning: number;
  sources: [string, number][];
  browsers: [string, number][];
  devices: [string, number][];
  countries: [string, number, string | undefined][]; // name, count, countryCode
};

function topEntries(map: Map<string, number>, n = 5): [string, number][] {
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
}

export function computeVisitAnalytics(visits: VisitRecord[]): VisitAnalytics {
  // Identify a visitor by IP first (so the same person is recognised across
  // normal + incognito windows on the same network), falling back to the
  // per-browser id or doc id. Works on old records that predate visitorId.
  const visitsByVisitor = new Map<string, number>();
  const sources = new Map<string, number>();
  const browsers = new Map<string, number>();
  const devices = new Map<string, number>();
  const countries = new Map<string, number>();
  const countryCodes = new Map<string, string>();

  for (const v of visits) {
    const identity = v.ipLocation?.ip ?? v.visitorId ?? v.id;
    visitsByVisitor.set(identity, (visitsByVisitor.get(identity) ?? 0) + 1);
    if (v.source) sources.set(v.source, (sources.get(v.source) ?? 0) + 1);
    if (v.browser) browsers.set(v.browser, (browsers.get(v.browser) ?? 0) + 1);
    if (v.device) devices.set(v.device, (devices.get(v.device) ?? 0) + 1);
    const country = v.ipLocation?.country;
    if (country) {
      countries.set(country, (countries.get(country) ?? 0) + 1);
      if (v.ipLocation?.countryCode) countryCodes.set(country, v.ipLocation.countryCode);
    }
  }

  // Unique = distinct visitors; Returning = visitors seen more than once;
  // New = visitors seen exactly once. (New + Returning = Unique.)
  const unique = visitsByVisitor.size;
  let returning = 0;
  for (const count of visitsByVisitor.values()) if (count > 1) returning++;
  const newVisitors = unique - returning;

  return {
    total: visits.length,
    unique,
    newVisitors,
    returning,
    sources: topEntries(sources),
    browsers: topEntries(browsers),
    devices: topEntries(devices),
    countries: topEntries(countries).map(([name, count]) => [name, count, countryCodes.get(name)]),
  };
}

// Turns a 2-letter country code into its flag emoji (e.g. "KW" → 🇰🇼).
export function countryFlag(code?: string): string {
  if (!code || code.length !== 2) return "🌐";
  return String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}
