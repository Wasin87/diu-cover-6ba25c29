# Deploying to Vercel

This project is a TanStack Start app. It is configured to build for Cloudflare
Workers by default (used by the Lovable preview) and automatically switches to
the **Vercel** build target when Vercel is the host (detected via the
`VERCEL=1` environment variable that Vercel injects at build time).

## 1. Import the repo in Vercel

1. Go to <https://vercel.com/new> and import this Git repository.
2. **Framework Preset:** `Other` (leave as-is — `vercel.json` already sets
   the correct build command).
3. **Build Command:** `vite build` (auto-filled from `vercel.json`).
4. **Install Command:** `npm install --legacy-peer-deps` (auto-filled).
5. **Output Directory:** `.vercel/output` (auto-filled — this is the
   TanStack Start Vercel build output directory).
6. **Node.js Version:** `20.x` or `22.x` (set in Project Settings → General).

## 2. Environment Variables

This project does **not** use any backend, database, auth, or external APIs.
All logic is client-side (cover-page generation, PDF/PNG export, PWA).

You therefore do **not** need to add any environment variables in Vercel for
the app to run. Vercel itself sets `VERCEL=1` automatically — that is what
this project uses to switch its build target. You do not need to add it
manually.

### Optional variables

Add these in **Vercel → Project → Settings → Environment Variables** only if
you want to customise behaviour:

| Key                  | Value (example)                              | Required | Scope                     | Purpose                                                            |
| -------------------- | -------------------------------------------- | -------- | ------------------------- | ------------------------------------------------------------------ |
| `NODE_VERSION`       | `20`                                         | No       | Production, Preview, Dev  | Pin Node version if the default Vercel image changes.              |
| `VITE_SITE_URL`      | `https://your-domain.vercel.app`             | No       | Production, Preview, Dev  | If you later want to read the canonical URL from client code.      |

> Anything prefixed with `VITE_` is inlined into the client bundle at build
> time, so never put secrets there.

### Variables you should NOT add

- `VERCEL` — set automatically by Vercel, do not add.
- `CI` — set automatically by Vercel.
- Any Cloudflare / wrangler variables — ignored on Vercel.

## 3. Deploy

Click **Deploy**. The first build runs:

```
npm install --legacy-peer-deps
VERCEL=1 vite build           # writes .vercel/output/
```

Vercel then serves the `.vercel/output` directory directly (TanStack Start's
Vercel target produces the standard Vercel Build Output v3 format, so no
extra rewrites or functions config is needed).

## 4. Custom Domain (optional)

Project → Settings → Domains → Add. Vercel will issue an SSL certificate
automatically.

## 5. Troubleshooting

- **`Cannot find module '@cloudflare/vite-plugin'` on Vercel** — make sure
  `VERCEL=1` is present at build time (it always is on Vercel). Locally you
  can simulate the Vercel build with `VERCEL=1 vite build`.
- **404 on a deep link / hard refresh** — the Vercel target handles this
  automatically via Build Output v3 routes. If you accidentally set
  `outputDirectory` to `dist`, change it back to `.vercel/output`.
- **PWA install prompt missing in production** — service workers are only
  registered on non-preview hostnames; this is intentional and works on any
  Vercel `*.vercel.app` or custom domain.
