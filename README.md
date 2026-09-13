# Portbuff

Investment platform with a public landing page, user dashboard, and admin panel.

Two apps live in this repository:

- `next-app/` — the primary Next.js 16.3.0 app (App Router). All new work happens here.
- `src/`, `vite.config.ts`, etc. — the legacy Vite + React app, kept for reference.

## Run the Next.js app

```bash
cd next-app
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Structure (next-app/)

- `app/` — routes: `/` landing, `/auth`, `/dashboard/*`, `/admin/*`
- `components/` — landing sections, layouts, auth, chat
- `lib/` — i18n, Zustand store, types, mock data, helpers
- `locales/` — `en-US.json`, `es-ES.json`

## i18n

All UI copy lives in `locales/*.json` (plus `landing.*` keys). The admin
Languages page includes a translation editor for creating custom languages
with runtime registration.

## Demo credentials

- User: `demouser@portbuff.com` / `demo1234`
- Admin: `admin@portbuff.com` / `admin123`
