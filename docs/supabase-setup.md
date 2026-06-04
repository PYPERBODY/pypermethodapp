# Supabase Setup — The PYPER Method Interactive Guide

Phase 5 adds the authentication and secure storage foundation for guide-related data only. It does not connect tracker forms to production storage yet.

## Required frontend environment variables

Copy `.env.example` to `.env.local` for local development:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

Netlify should define the same variables in Site configuration → Environment variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Do not commit `.env`, `.env.local`, or real keys. Do not place Supabase service-role keys in Vite variables or frontend code.

## Apply schema

Use the SQL in either file:

- `supabase/schema.sql`
- `supabase/migrations/20260604201900_phase5_auth_storage_foundation.sql`

The migration creates guide-related tables and enables Row Level Security.

## Phase 5 behavior

- Supabase Auth protects the Interactive Guide shell.
- If env vars are missing, the app shows a clear protected-access setup state instead of crashing.
- Tracker forms still use fictional demo data/local component state.
- Production tracker persistence starts in Phase 6.

## Security safeguards

- Health-related guide data should not be stored in unsecured `localStorage` in production.
- Real patient data should not be used in demo mode.
- Supabase service-role keys must never be exposed in frontend code.
- Health data must not be sent to affiliate links.
- Health data must not be sent to analytics.
- Health data must not be sent to advertising pixels.
- Session replay should not be used in authenticated health-related areas.
- Private offer codes must never be publicly readable.

## RLS model

For user-owned tables, users can select, insert, update, and delete only rows where `user_id = auth.uid()`.

For `profiles`, users can select, insert, and update only the profile row where `id = auth.uid()`.

Affiliate products may be publicly readable only when active. Partner offer details require authentication unless explicitly configured as active, non-member, non-unique-code public offers. Private offer codes are readable only by the assigned user.


## Compatibility with Supabase setup snippets

This repository is a Vite React app, not a Next.js app. Use `src/lib/supabaseClient.ts` or `utils/supabase/client.ts` for browser auth. Do not add Next-only `page.tsx`, `server.ts`, or middleware files unless the app is migrated to Next.

The Vite config exposes both `VITE_*` and `NEXT_PUBLIC_*` prefixes, so the following public variables are also supported:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
