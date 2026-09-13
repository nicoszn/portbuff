# Portbuff Next.js rewrite status

## What is committed
- Next.js 16.3.0 app in `next-app/`
- Landing page, auth, user dashboard, admin panel
- i18n with en-US, es-ES, and runtime custom languages
- Zustand store, types, mock data, and helpers ported

## Remaining work
- Remove duplicate i18n and admin UI placeholder refs
- Verify landing page renders without errors in Next.js build/client
- Verify admin pages render with real store state
- Confirm app shell routing matches the desired final flow
- Decide whether `next-app/` replaces the old Vite app entirely
- Update repo README and deployment instructions for Next.js
