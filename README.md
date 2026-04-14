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

### 3) Restart app

Restart `npm run dev` after adding env vars.

When env vars are present, app switches to cloud mode automatically.
