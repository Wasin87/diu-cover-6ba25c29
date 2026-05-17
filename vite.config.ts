// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// When deploying to Vercel, Vercel sets the `VERCEL=1` env var during the build.
// In that case we disable the Cloudflare plugin and switch the TanStack Start
// build target to "vercel" so the output is a Vercel-compatible serverless build.
const isVercel = !!process.env.VERCEL;

export default defineConfig(
  isVercel
    ? {
        cloudflare: false,
        tanstackStart: { target: "vercel" },
      }
    : {},
);
