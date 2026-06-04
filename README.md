
  # The PYPER Method Interactive Guide

  The primary PYPER delivery product is The PYPER Method Interactive Guide + installable PWA.

  It is a responsive digital replacement for the static PYPER Method GLP-1 guide, built for web, mobile phones, tablets, and desktop. The Guide remains the heart of the product, with supporting tracking, reminders, progress, safety, and PYPER Edit features.

  Product rhythm: Learn → Track → Review → Maintain.

  Companion formats are generated from the same approved content source:

  - The PYPER Method Goodnotes Edition
  - The PYPER Method Printable PDF Edition

  This project is not the main PYPER member portal or patient portal for pyperbody.com.

  ## Running the code

  Run `pnpm install` to install the dependencies.

  Run `pnpm run dev` to start the development server.

  Run `pnpm run build` to create the production build in `dist/`.


  ## Phase 5 auth environment

  Supabase Auth is configured with public Vite variables only:

  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

  Copy `.env.example` to `.env.local` for local development. Do not commit real keys or service-role keys. If the variables are missing, the app shows a protected access setup state instead of crashing.
