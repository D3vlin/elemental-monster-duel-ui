# elemental-monster-duel-ui

Vite + React + TypeScript frontend for Elemental Monster Duel.
Deployed as a static site to **GitHub Pages**.

- **URL:** https://d3vlin.github.io/elemental-monster-duel-ui/
- **API:** the Render service, via `import.meta.env.VITE_API_URL`

## Develop

```bash
pnpm install
pnpm run dev        # http://localhost:5173
pnpm test
```

## Deploy (GitHub Pages)

One-time setup:

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions → Variables →** add
   `VITE_API_URL` = `https://elemental-monster-duel-api.onrender.com`
   (see `.env.example`).

Then every push to `main` runs `.github/workflows/deploy-pages.yml`:
`pnpm install` → `pnpm run build` → upload `dist/` → `deploy-pages`.

### Notes

- `vite.config.ts` sets `base` to `/elemental-monster-duel-ui/` for `vite build`
  (the project-pages sub-path); dev stays at `/`.
- `dist/404.html` is a copy of `index.html` so client-side routes deep-link on Pages.
- The Render free instance sleeps after ~15 min idle; the first request wakes it
  (cold start ~30 s). The API must allow the Pages origin via CORS
  (`APP_CORS_ALLOWED_ORIGINS=https://d3vlin.github.io` on Render).
