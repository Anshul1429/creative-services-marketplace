# Creative Services Marketplace

A frontend-only creative services marketplace demo built with React, Vite, JSX, Tailwind CSS 4, and React Router. It uses local mock data and browser storage; it is not connected to a production backend.

## Requirements

- Node.js 20.19+ or 22.12+ (required by the Vite 8 toolchain)
- npm

The project uses npm and `package-lock.json` as its package manager source of truth.

## Install and run

```sh
npm ci
npm run dev
```

Vite prints the local URL after startup (normally `http://localhost:5173`).

## Demo accounts

Use only these public demo credentials:

| Role | Email | Password |
| --- | --- | --- |
| Buyer | `buyer@demo.com` | `buyer123` |
| Seller | `seller@demo.com` | `seller123` |

These are intentionally public credentials for the demo, not secrets. Authentication is simulated in the browser and stored client-side; it is not secure and must not protect real data.

## Build and preview

```sh
npm run build
npm run preview
```

The production output is written to `dist/`. The preview server is for local validation only; use your hosting provider's static-site deployment for production.

## Deployment

Deploy the contents of `dist/` as a static site. Because the app uses `BrowserRouter`, the host must serve `index.html` for unknown application paths while continuing to serve existing assets normally. This is required for direct nested URLs and refreshes.

Included hosting configuration:

- **Netlify:** `public/_redirects` is copied into `dist/` and rewrites application paths to `index.html`.
- **Vercel:** `vercel.json` rewrites requests to the SPA entry point.

For either provider, use `npm run build` as the build command and `dist` as the output/publish directory. If choosing another host, configure its equivalent SPA fallback/rewrite. Verify a direct load and refresh on a nested route such as `/categories/graphic-design` after deployment.

No production API URL or server credentials are required by this frontend. The current pages do not call an application backend.

## Demo behavior and production limitations

- Service listings, orders, reviews, portfolio entries, conversations, notifications, onboarding, profiles, and payout preferences are sample/demo state persisted in browser storage. Clearing site data removes that state.
- Checkout creates a simulated local order only. No real payment, refund, escrow, or payout can occur.
- Messaging is browser-local simulation; it does not send messages to another user or a server.
- Sign-in, registration, password recovery, role switching, and logout are demo flows, not production authentication or account recovery.
- Seller publishing and buyer/seller workflows update this browser's demo data only; they do not publish to a server or notify another browser.
- Support/contact submissions are local demo confirmations only.
- Do not enter real passwords, payment details, bank information, or sensitive project information.
- Production use requires a backend for authentication/authorization, shared data, validation, file storage, messaging, payments, payouts, and support handling.

## SEO and external assets

Public routes are configured for indexing; account, seller, checkout, authentication, and unknown routes are marked `noindex`. Route titles, descriptions, and Open Graph title/description are updated by the client-side router. This SPA does not provide server-rendered metadata, a domain-specific canonical URL, or a sitemap. Set the final domain and consider prerendering/SSR before relying on social previews or search indexing at scale. `public/robots.txt` excludes private workspace and authentication paths.

Illustrative listing images are loaded from Unsplash and the DM Sans/Manrope fonts are loaded from Google Fonts. A user's network, browser privacy settings, or those third-party services can prevent them from loading. Replace these URLs with appropriately licensed, owned assets for a production launch.
