// Builds the app for a plain Node.js host (SmarterASP.NET / IIS + iisnode).
//
// Sets NITRO_PRESET=node-server, which vite.config.ts picks up to switch the
// Nitro target away from Cloudflare. Output: .output/server/index.mjs (the
// server, listens on process.env.PORT) + .output/public (static assets).
//
// Done via a script rather than inline `NITRO_PRESET=... vite build` because
// that shell syntax does not work on Windows, which is what SmarterASP.NET runs.
import { spawnSync } from "node:child_process";

const result = spawnSync("vite", ["build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NITRO_PRESET: "node-server" },
});

process.exit(result.status ?? 1);
