# The PYPER Method Interactive Guide — Phase 1 Deployment Notes

## Commit

| | |
|---|---|
| Commit hash | `20a27b5` |
| Branch | `claude/festive-fermi-JxbSF` |
| Commit message | Build Phase 1 The PYPER Method Interactive Guide |
| Files | 82 source files, 12,584 insertions |

---

## Framework

- **Framework:** React 18 + Vite 6 + TypeScript + Tailwind CSS v4
- **Component library:** shadcn/ui (Radix UI primitives)
- **Package manager:** pnpm 10

---

## Build

| Setting | Value |
|---|---|
| **Build command** | `pnpm run build` |
| **Netlify publish directory** | `dist` |
| **Node version** | 22 |
| **Expected homepage file** | `index.html` (SPA entry, inside `dist/`) |

### Netlify config file

`netlify.toml` is included at the repository root and configures everything automatically:

```toml
[build]
  command = "pnpm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

The `[[redirects]]` rule is required for client-side routing — without it, direct URL access and refreshes will 404.

---

## Production Build Result

**Build passed. No errors.**

```
vite v6.3.5 building for production...
✓ 2250 modules transformed.

dist/index.html                   0.76 kB │ gzip:   0.42 kB
dist/assets/index-BuAsfbcL.css   74.96 kB │ gzip:  12.87 kB
dist/assets/index-BklSd6mg.js   650.90 kB │ gzip: 187.82 kB

✓ built in 7.99s
```

---

## Known Issues

1. **Chunk size warning** — Vite warns that `index-BklSd6mg.js` exceeds 500 kB after minification. This is a performance notice, not an error. The build succeeds and the app runs correctly. Resolution (Phase 2): enable code-splitting with `build.rollupOptions.output.manualChunks`.

2. **React/react-dom peer dependency** — The original `App Builder.zip` listed `react` and `react-dom` as optional peer dependencies, which caused build errors in a standalone environment. These were moved to `devDependencies` in `package.json`. No code was changed.

3. **esbuild / @tailwindcss/oxide build scripts** — pnpm 10 blocks install scripts by default. `pnpm.onlyBuiltDependencies` was added to `package.json` to allow these two native packages to compile. No code was changed.

4. **Demo data only** — All health tracker data is in component state (see `src/app/App.tsx` comment). No Supabase Auth or database is connected. This is by design for Phase 1.

5. **GitHub push blocked** — The Claude Code web session that built this project had read-only GitHub access. The commit is complete and signed locally. To push: grant the Claude Code GitHub App write access to `pypermethodapp` at `github.com/settings/installations`, then run `git push -u origin claude/festive-fermi-JxbSF`.

---

## Quick-start for Developers

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm run dev

# 3. Production build
pnpm run build

# 4. Preview production build locally
pnpm exec vite preview
```

---

## Portal Structure

```
src/app/
  App.tsx                          Root component, tab state
  components/
    pyper/
      Shell.tsx                    Layout shell, desktop sidebar, mobile nav
      Today.tsx                    Today dashboard
      Method.tsx                   Guide chapters + Seven Pillars
      Trackers.tsx                 Repeatable trackers (Tolerance Tracker live)
      Reminders.tsx                Reminder list + CRUD
      Progress.tsx                 Progress charts (Recharts)
      Edit.tsx                     The PYPER Edit — partner offers
      Safety.tsx                   Safety tab
      Support.tsx                  Provider queue + export preview
      data.ts                      Seed data for all tabs
    ui/                            30 shadcn/ui components
    figma/
      ImageWithFallback.tsx        Image error fallback
  styles/
    theme.css                      PYPER color tokens + typography
    fonts.css                      Google Fonts import
    tailwind.css                   Tailwind v4 source config
    index.css                      Root CSS entrypoint
```
