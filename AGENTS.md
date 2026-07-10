# AGENTS.md

## Cursor Cloud specific instructions

### What this is
PYPER Member Portal — a mobile-first React 18 + TypeScript SPA built with Vite 6 and
Tailwind CSS v4 (a Figma "Make"/App Builder export). It is **frontend-only**: all tracker
data lives in in-memory React state (demo/prototype), so no database, backend, or env vars
are required to run or test the app end-to-end. Entry points: `index.html` → `src/main.tsx`
→ `src/app/App.tsx` (tab shell: Today, Method, Trackers, Reminders, Progress, The PYPER
Edit, Safety, Support).

### Package manager
Use **pnpm** (there is a `pnpm-lock.yaml` + `pnpm-workspace.yaml`). The `README.md`
instructions that say `npm i` / `npm run dev` are stale — ignore them and use pnpm.

### Run / build (see `package.json` scripts)
- Dev server: `pnpm run dev` — Vite serves on `http://localhost:5173` (no port override).
- Production build: `pnpm run build` — outputs to `dist/`.

### Non-obvious gotchas
- **No lint, test, or typecheck scripts exist**, and there is **no `tsconfig.json`**. Do not
  attempt `pnpm run lint`/`test` or a standalone `tsc` — they are not configured. The only
  validation is `pnpm run build` (Vite/esbuild transpiles without type-checking).
- `vite.config.ts` defines a custom `figma:asset/...` import resolver mapping to
  `src/assets`, and aliases `@` → `src`. Don't remove the React/Tailwind Vite plugins.
- The `supabase/` directory (Deno/Hono edge function + KV store) and `utils/supabase/` are
  **future scaffolding not wired to the frontend**. Ignore them for running/testing the app.
- `.gitignore` excludes `.env*`, but no env file is needed.
