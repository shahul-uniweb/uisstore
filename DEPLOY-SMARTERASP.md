# Deploying UiS Store to SmarterASP.NET

This is a **Node.js SSR app** (TanStack Start + Nitro), not a .NET app. It must run on a
SmarterASP.NET **Node.js** plan — the Git-deploy panel's "Build Command" / "Start Command"
fields are what we target.

## Commands to enter in the SmarterASP.NET panel

| Field | Value |
|---|---|
| **Build Command** | `npm install --legacy-peer-deps && npm run build:node` |
| **Start Command** | `npm start` |
| **Git Branch** | `main` |
| **Node version** | **20 or higher** (set this in the panel — the build fails on older Node) |

That's it. `npm start` runs `node dist/server/index.mjs`, which listens on `process.env.PORT`
(SmarterASP.NET sets this) and serves both the SSR HTML and all static assets.

## What each piece does

- **`npm run build:node`** → runs `scripts/build-node.mjs`, which sets `NITRO_PRESET=node-server`
  and builds. This switches the Nitro target from Cloudflare (the default) to a plain Node
  server. Output:
  - `dist/server/index.mjs` — the server
  - `dist/client/` — static assets, `robots.txt`, `sitemap.xml`, `llms.txt`, `og-image.png`
- **`.npmrc`** (`legacy-peer-deps=true`) — without this, plain `npm install` **fails** with
  `ERESOLVE` because the pinned `nitro` version is older than the peer range
  `@lovable.dev/vite-tanstack-config` asks for. Bun ignores this; npm does not.
- **`web.config`** — only used if SmarterASP.NET runs the app through IIS/**iisnode**. If the
  panel accepts a Start Command and manages the Node process itself, this file is ignored and
  can be left alone.

## Why the 403 happened

A 403 "Forbidden: Access is denied" means IIS found **no `index.html`** in the site root. That's
expected: this app has no `index.html` — the HTML is generated per-request by the Node server.
Setting the Start Command above fixes it. (There is no static-export path: the Nitro `static`
preset is incompatible with this toolchain — it was tried and fails.)

## Local commands (for reference)

```bash
bun install          # local dev uses Bun, NOT npm
bun run dev          # dev server
bun run build:node   # produce the exact artifact SmarterASP.NET runs
bun run start        # run that artifact locally (http://localhost:3000)
```

## Notes

- The domain is **uisstore.net** — point it at the SmarterASP.NET site and make sure HTTPS is
  enabled (all the SEO canonical/OG tags are hard-coded to `https://uisstore.net/`).
- Firebase, the lead form, IP/GPS capture and WhatsApp links are all **client-side** — they work
  the same regardless of host, no server config needed.
- If SmarterASP.NET turns out not to support Node on your plan, this app cannot run there.
  The zero-config alternatives already supported by `vite.config.ts` are **Vercel** (sets
  `VERCEL=1` automatically) and **Cloudflare** (the default preset).
