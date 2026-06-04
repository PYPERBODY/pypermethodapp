# PYPER Member Portal — Phase 1 File Manifest

Source ZIP: `pypermethodapp-phase1-source.zip` (1.7 MB)
Commit: `20a27b5` — Build Phase 1 PYPER Member Portal

---

## Configuration & Build

| File | Description |
|---|---|
| `.gitignore` | Excludes node_modules, dist, .env files |
| `index.html` | Vite SPA entry point |
| `netlify.toml` | Netlify build config — command, publish dir, SPA redirect |
| `package.json` | Dependencies, scripts, pnpm build-script approvals |
| `pnpm-lock.yaml` | Exact dependency lockfile |
| `pnpm-workspace.yaml` | pnpm workspace root declaration |
| `postcss.config.mjs` | PostCSS config (Tailwind v4 handled via Vite plugin) |
| `vite.config.ts` | Vite config — React plugin, Tailwind plugin, @ alias |

---

## Portal Source — Entry Points

| File | Description |
|---|---|
| `src/main.tsx` | React root mount |
| `src/app/App.tsx` | Root component, tab routing state |

---

## Portal Source — PYPER Components

| File | Description |
|---|---|
| `src/app/components/pyper/Shell.tsx` | Layout shell: desktop sidebar, mobile top bar, bottom nav |
| `src/app/components/pyper/Today.tsx` | Today dashboard: date, greeting, action cards, reminders, weekly check-in |
| `src/app/components/pyper/Method.tsx` | Method guide: Seven Pillars, chapter list, accordions |
| `src/app/components/pyper/Trackers.tsx` | Repeatable trackers: Tolerance Tracker fully interactive; 7 scaffolded |
| `src/app/components/pyper/Reminders.tsx` | Reminders list: toggle, duplicate, delete, privacy notice |
| `src/app/components/pyper/Progress.tsx` | Progress Studio: stats, area chart, line chart, signal labels |
| `src/app/components/pyper/Edit.tsx` | The PYPER Edit: affiliate + partner offers, category filter |
| `src/app/components/pyper/Safety.tsx` | Safety tab: emergency notice, red flags, safety boundaries |
| `src/app/components/pyper/Support.tsx` | Support: provider queue, export preview modal, community guidelines |
| `src/app/components/pyper/data.ts` | Seed data: member, cards, reminders, chapters, pillars, trackers, offers, progress, safety |

---

## Portal Source — UI Components (shadcn/ui)

| File | Description |
|---|---|
| `src/app/components/ui/accordion.tsx` | Accordion (used in Method guide) |
| `src/app/components/ui/alert-dialog.tsx` | Alert dialog |
| `src/app/components/ui/alert.tsx` | Alert banner |
| `src/app/components/ui/aspect-ratio.tsx` | Aspect ratio container |
| `src/app/components/ui/avatar.tsx` | Avatar with fallback |
| `src/app/components/ui/badge.tsx` | Badge chip |
| `src/app/components/ui/breadcrumb.tsx` | Breadcrumb navigation |
| `src/app/components/ui/button.tsx` | Button with variants |
| `src/app/components/ui/calendar.tsx` | Calendar date picker |
| `src/app/components/ui/card.tsx` | Card container |
| `src/app/components/ui/carousel.tsx` | Embla-based carousel |
| `src/app/components/ui/chart.tsx` | Recharts wrapper |
| `src/app/components/ui/checkbox.tsx` | Checkbox |
| `src/app/components/ui/collapsible.tsx` | Collapsible panel |
| `src/app/components/ui/command.tsx` | Command palette |
| `src/app/components/ui/context-menu.tsx` | Right-click context menu |
| `src/app/components/ui/dialog.tsx` | Modal dialog |
| `src/app/components/ui/drawer.tsx` | Bottom/side drawer (Vaul) |
| `src/app/components/ui/dropdown-menu.tsx` | Dropdown menu |
| `src/app/components/ui/form.tsx` | React Hook Form wrapper |
| `src/app/components/ui/hover-card.tsx` | Hover card |
| `src/app/components/ui/input-otp.tsx` | OTP input |
| `src/app/components/ui/input.tsx` | Text input |
| `src/app/components/ui/label.tsx` | Form label |
| `src/app/components/ui/menubar.tsx` | Menu bar |
| `src/app/components/ui/navigation-menu.tsx` | Navigation menu |
| `src/app/components/ui/pagination.tsx` | Pagination controls |
| `src/app/components/ui/popover.tsx` | Popover |
| `src/app/components/ui/progress.tsx` | Progress bar |
| `src/app/components/ui/radio-group.tsx` | Radio group |
| `src/app/components/ui/resizable.tsx` | Resizable panels |
| `src/app/components/ui/scroll-area.tsx` | Styled scroll area |
| `src/app/components/ui/select.tsx` | Select dropdown |
| `src/app/components/ui/separator.tsx` | Horizontal/vertical rule |
| `src/app/components/ui/sheet.tsx` | Side sheet |
| `src/app/components/ui/sidebar.tsx` | Sidebar scaffold |
| `src/app/components/ui/skeleton.tsx` | Loading skeleton |
| `src/app/components/ui/slider.tsx` | Range slider (used in Trackers) |
| `src/app/components/ui/sonner.tsx` | Toast notifications |
| `src/app/components/ui/switch.tsx` | Toggle switch |
| `src/app/components/ui/table.tsx` | Table |
| `src/app/components/ui/tabs.tsx` | Tab strip |
| `src/app/components/ui/textarea.tsx` | Textarea |
| `src/app/components/ui/toggle-group.tsx` | Toggle group |
| `src/app/components/ui/toggle.tsx` | Toggle button |
| `src/app/components/ui/tooltip.tsx` | Tooltip |
| `src/app/components/ui/use-mobile.ts` | Mobile breakpoint hook |
| `src/app/components/ui/utils.ts` | `cn()` utility (clsx + tailwind-merge) |

---

## Portal Source — Figma Helper

| File | Description |
|---|---|
| `src/app/components/figma/ImageWithFallback.tsx` | Image with error-state fallback |

---

## Styles

| File | Description |
|---|---|
| `src/styles/index.css` | Root CSS — imports fonts, Tailwind, theme |
| `src/styles/fonts.css` | Google Fonts: Fraunces, Inter, JetBrains Mono |
| `src/styles/tailwind.css` | Tailwind v4 source directive + tw-animate-css |
| `src/styles/theme.css` | PYPER design tokens: porcelain, ivory, bone, steel, graphite; typography scale; `.mono-label`, `.rule` |
| `src/styles/globals.css` | Global overrides (empty — reserved) |

---

## Backend Scaffolds

| File | Description |
|---|---|
| `supabase/functions/server/index.tsx` | Deno/Hono server stub (future edge functions) |
| `supabase/functions/server/kv_store.tsx` | Supabase KV store helper |
| `utils/supabase/info.tsx` | Supabase project ID and anon key |

---

## Documentation

| File | Description |
|---|---|
| `CLAUDE.md` | PYPER Master Prompt — full product spec |
| `PYPER_Member_Portal_Master_Prompt_CLAUDE.md` | Duplicate of master prompt |
| `README.md` | Project README (from App Builder scaffold) |
| `ATTRIBUTIONS.md` | shadcn/ui and Unsplash license attributions |
| `guidelines/Guidelines.md` | Figma Make development guidelines |
| `src/imports/pasted_text/pyper-member-portal.md` | Portal spec pasted into Figma Make session |

---

## Brand Assets

| File | Description |
|---|---|
| `pyper logo.svg` | PYPER logo (SVG) |
| `pyper logo.png` | PYPER logo (PNG) |
| `GTFRiposteTRIAL-SemiBold.otf` | Display font (trial) |
| `PPKyoto-Medium.otf` | Display font |
| `default_shadcn_theme.css` | shadcn default theme reference (unused in portal) |

---

## Reference / Legacy HTML

| File | Description |
|---|---|
| `previewv2.html` | PYPER Method content preview (source reference) |
| `index2106tots.html` | Standalone HTML portal prototype (reference) |
| `consumer-health-data-privacy.html` | Legal page |
| `contact.html` | Contact page |
| `privacy.html` | Privacy policy |
| `sms-terms.html` | SMS terms |
| `terms.html` | Terms of service |

---

## Netlify Output ZIP Contents

`pypermethodapp-phase1-netlify-output.zip` (197 KB)

| File | Size | Description |
|---|---|---|
| `index.html` | 757 B | SPA shell — root entry point |
| `assets/index-BuAsfbcL.css` | 74.96 kB | All compiled styles |
| `assets/index-BklSd6mg.js` | 650.90 kB | All compiled JavaScript |

Total uncompressed: ~726 kB. Gzipped transfer: ~201 kB.
