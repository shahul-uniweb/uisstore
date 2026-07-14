# Admin Panel

Live at **`/admin`** on the deployed site (e.g. `https://uisstore.net/admin`). Not linked
from the public nav — it's a private URL, not a secret one, so real auth is what protects it,
not obscurity. It's excluded from search engines (`noindex, nofollow`) and from `sitemap.xml`.

## One-time setup (required before anyone can sign in)

### 1. Enable Email/Password sign-in — already done ✅
Verified: `Authentication → Sign-in method → Email/Password` is enabled on the `uis-store`
Firebase project. Nothing to do here.

### 2. Update Firestore rules
Paste this in **Firebase Console → Firestore Database → Rules → Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leads/{doc}  { allow create: if true; allow read, update: if request.auth != null; allow delete: if false; }
    match /visits/{doc} { allow create: if true; allow read: if request.auth != null; allow delete: if false; }
    match /users/{doc}  { allow read, write: if request.auth != null; }
  }
}
```

What this does, line by line:
- `leads` — the public website can **create** records (the form), any **signed-in** admin can
  **read** them AND **update** them (needed for the Forms page CRM fields: customer name, status,
  package, address, emails, etc.). Deletes are blocked.
- `visits` — public **create** (visit logger), signed-in **read**. No edit/delete.
- `users` — any signed-in admin can read/write (needed for sign-in to look up permissions, and
  for the Users page). Without *any* `/users` rule, Firestore denies it by default and sign-in
  breaks entirely.

**Security note:** `request.auth != null` just means "any successfully signed-in Firebase Auth
user" — intentionally simple for this initial stage, not fine-grained. A signed-in low-permission
admin could technically read/write these collections directly via the SDK, bypassing the UI's
own menu restrictions. Tell me when you want it hardened (e.g. only super admins or users with
the matching permission can read each collection) and I'll tighten it.

### 3. Create the two permanent super admin accounts + Firestore profiles
**Auth account** — go to `/admin/login`, enter `shahul@uniwebonline.com` or
`aneeshbabu@uniwebonline.com` with a password of your choice, and the login page offers
**"Create My Super Admin Account"** the first time (no account exists yet for that email). Works
only for those two exact addresses, and only until the account exists — it's a one-time
bootstrap, not an open sign-up.

Their **menu access never depends on Firestore** — `shahul@` and `aneeshbabu@` always get every
menu purely from the hardcoded email check in `src/lib/admin.ts`, whether or not a Firestore
document exists for them. So the step below is optional and purely cosmetic: it's what makes
them *appear* in the Users page's table with a proper name, instead of just working invisibly.

To add them (per the "create it yourself, initial stage" approach) — **Firebase Console →
Firestore Database → Start collection → `users`**:

1. Sign in once at `/admin/login` with each account (step above).
2. **Firebase Console → Authentication → Users** — copy that person's **User UID**.
3. In Firestore, create a document in the `users` collection whose **Document ID is that exact
   UID** (this must match — the app looks the profile up by UID, not by email), with these fields:

   | Field | Type | Value |
   |---|---|---|
   | `name` | string | `Shahul` or `Aneesh Babu` |
   | `email` | string | their email |
   | `role` | string | `Super Admin` |
   | `permissions` | array | `dashboard`, `visits`, `forms`, `users` (4 string entries) |
   | `active` | boolean | `true` |

Repeat for both. Get the UID wrong (or skip this step entirely) and nothing breaks — they keep
full access either way, they just won't show up in the Users list until it's added correctly.

## How access control works

- **Two fixed super admins** — `shahul@uniwebonline.com` (Shahul) and
  `aneeshbabu@uniwebonline.com` (Aneesh Babu) — are hardcoded in
  `src/lib/admin.ts` (`SUPER_ADMIN_EMAILS`) and always have every menu, regardless of what's
  stored in Firestore. This is a safety net: a bad Firestore edit can never lock them out.
- **Every other user** has a `permissions: string[]` array (menu keys: `dashboard`, `visits`,
  `forms`, `users`) set when a super admin creates them from the **Users** menu, and editable
  afterwards. Their `role` (Admin / Manager / Viewer) is just a display label — the permissions
  array is what actually gates access. Right now that gating happens in the UI only (the
  Firestore rule above allows any signed-in user to read/write `/users`) — see the "Note" under
  step 2 above about hardening this later.
- Granting someone the `users` permission lets them manage other admin users too, including
  creating new ones — treat it like a super-admin-lite grant.

## Adding a new admin user

Users menu → **Add User** → name, email, role, tick the menus they should see → Create.
This creates their Firebase Auth account with a random password they never see, writes their
Firestore profile, and emails them a **"set your password"** link automatically. No server / Admin
SDK involved — it's a throwaway secondary Firebase app instance under the hood so it doesn't
disturb your own signed-in session.

**Known limitation:** there's no server-side Admin SDK in this project, so a user can be
*disabled* (toggle "Active" off in Edit) but not fully deleted from Firebase Auth from the UI —
disabling blocks their sign-in effectively the same way. True deletion would need a Cloud
Function or the Admin SDK, which isn't set up here.

## Interactive map

Visits page uses **Leaflet + OpenStreetMap** — free, no API key, nothing to configure. Markers
are grouped by ~1km so a busy city doesn't turn into a wall of pins; click one to see the
visit/lead count for that area. Blue = visits, magenta = form leads (leads use the customer's
exact browser GPS pin when they granted it, otherwise the same IP-based location as visits).

## Pages

| Menu | Path | Shows |
|---|---|---|
| Dashboard | `/admin` | Stat cards, 14-day visits/leads chart, top countries, recent submissions |
| Visits & Map | `/admin/visits` | Interactive map + full visits table |
| Forms | `/admin/forms` | Every popup submission, WhatsApp shortcut, full location detail dialog |
| Users | `/admin/users` | User list, Add/Edit dialogs with permission checkboxes |
