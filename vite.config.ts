// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Vercel sets VERCEL=1 during builds. Only then do we force the Nitro "vercel"
// preset and emit the Build Output API layout (.vercel/output) that Vercel
// auto-detects. Locally and inside the Lovable sandbox this branch is skipped,
// so Lovable keeps using its default cloudflare-module target untouched.
const isVercel = !!process.env.VERCEL;

// NITRO_PRESET=node-server (set by `npm run build:node`) targets a plain Node.js
// host — e.g. SmarterASP.NET / IIS+iisnode — instead of the default Cloudflare
// worker target. Produces a standalone server at .output/server/index.mjs that
// listens on process.env.PORT.
const isNodeServer = process.env.NITRO_PRESET === "node-server";

export default defineConfig({
  ...(isVercel
    ? {
        nitro: {
          preset: "vercel",
          output: {
            dir: ".vercel/output",
            serverDir: ".vercel/output/functions/__server.func",
            publicDir: ".vercel/output/static",
          },
        },
      }
    : {}),
  ...(isNodeServer ? { nitro: { preset: "node-server" } } : {}),
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
