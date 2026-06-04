import { createBrowserClient } from "@supabase/ssr";

const env = import.meta.env;

const supabaseUrl =
  (env.VITE_SUPABASE_URL as string | undefined) ||
  (env.NEXT_PUBLIC_SUPABASE_URL as string | undefined);
const supabasePublishableKey =
  (env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string | undefined);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = isSupabaseConfigured
  ? createBrowserClient(supabaseUrl!, supabasePublishableKey!)
  : null;

export const supabaseConfigMessage = isSupabaseConfigured
  ? null
  : "Supabase is not configured. Add VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to enable guide sign-in.";

// Frontend safety rules:
// - This Vite app uses the browser client only; Next.js server/middleware helpers do not run here.
// - Never expose Supabase service-role keys in this React app.
// - Do not store health-related tracker data in unsecured localStorage in production.
// - Do not send health data to affiliate links, analytics, advertising pixels, or session replay tools.
// - Use fictional demo data only until secure Supabase storage and RLS policies are connected.
