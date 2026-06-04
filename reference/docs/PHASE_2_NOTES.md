# PYPER Member Portal — Phase 2 Notes

## Scope completed

Phase 2 expands the Method tab from a small demo into a complete responsive member guide sourced from `previewv2.html`.

### Added

- `src/app/components/pyper/methodContent.ts`
  - Structured content model with 15 portal chapters and 38 patient-facing guide sections.
  - Includes all patient-facing guide sections from the source guide except the cover and decorative divider pages.
  - Adds mobile table `data-label` attributes for responsive card rendering.
- Rebuilt `src/app/components/pyper/Method.tsx`
  - Chapter navigation
  - Search
  - Progress indicator
  - Save chapter placeholder
  - Add to provider questions placeholder
  - Mark complete placeholder
  - Related tracker and reminder links
  - Expandable chapter sections
  - Next chapter navigation
- Expanded `src/styles/theme.css`
  - Responsive Method content styling
  - Mobile table-to-card conversion
  - Guide cards, notices, quotes, pillars, phone cards, and appendix tools
- Added `METHOD_CONTENT_MAP.md`

## Intentionally not completed in Phase 2

- Secure database storage
- Authentication
- Working provider-question persistence
- Working chapter progress persistence
- Working tracker storage
- Reminders and notifications
- Progress charts connected to real data
- The PYPER Edit partner-offer backend

## Build status

The source changes were prepared in an environment without package-registry access, so the production build could not be re-run here. The Phase 1 project previously built successfully using:

- Build command: `pnpm run build`
- Publish directory: `dist`
- Node version: `22`

Netlify should build the updated source using the existing `netlify.toml` configuration after the files are uploaded to GitHub.
