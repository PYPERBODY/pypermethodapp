import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const supabaseConfigMessage = isSupabaseConfigured
  ? null
  : "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable guide sign-in.";

// Frontend safety rules:
// - Never expose Supabase service-role keys in this React app.
// - Do not store health-related tracker data in unsecured localStorage in production.
// - Do not send health data to affiliate links, analytics, advertising pixels, or session replay tools.
// - Use fictional demo data only until secure Supabase storage and RLS policies are connected.
