# Joinme

## Run locally

```bash
npm install
npm run dev
```

## Shared data across browsers (Supabase)

By default, the app uses browser `localStorage` (each browser/device is isolated).
To share users and groups across browsers, enable Supabase.

### 1) Create env file

Copy `.env.example` to `.env` and fill in your project values:

```bash
cp .env.example .env
```

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 2) Create database schema

In Supabase SQL Editor, run `supabase-schema.sql`.

### 3) Google sign-in (Dartmouth-only)

Production sign-in uses **Supabase Auth** with **Google**, restricted in the app to **`@dartmouth.edu`** emails (non‑Dartmouth Google sessions are rejected and signed out immediately).

In the Supabase dashboard:

1. **Authentication → Providers → Google**: enable it and paste the **OAuth Client ID / secret** from [Google Cloud Console](https://console.cloud.google.com/) (Consent screen + OAuth “Web application” credentials).
2. **Authentication → URL configuration**: under **Redirect URLs**, add  
   `http://localhost:5173/**`  
   and your production origin (e.g. `https://your-domain.com/**`).
3. The Google picker uses **`hd=dartmouth.edu`** to bias Dartmouth Workspace accounts; the app **still verifies** `@dartmouth.edu` on every session — personal Gmail accounts cannot proceed.

Without Google enabled in Supabase, “Continue with Google” will redirect to an error until the provider is configured.

### 4) Restart app

Restart `npm run dev` after adding env vars.

When env vars are present, app switches to cloud mode automatically.
