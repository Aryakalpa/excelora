import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || !supabaseUrl.startsWith('http')) {
    throw new Error(
      "BrowserClient: NEXT_PUBLIC_SUPABASE_URL is not configured correctly or is invalid. Please check your .env.local file and ensure it contains your actual Supabase project URL (e.g., https://<your-project-ref>.supabase.co)."
    );
  }
  if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    throw new Error(
      "BrowserClient: NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured correctly. Please check your .env.local file and ensure it contains your actual Supabase project anon key."
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
