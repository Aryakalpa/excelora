import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createSupabaseServerClient() {
  const cookieStore = cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || !supabaseUrl.startsWith('http')) {
    throw new Error(
      "ServerClient: NEXT_PUBLIC_SUPABASE_URL is not configured correctly or is invalid. Please check your .env.local file and ensure it contains your actual Supabase project URL (e.g., https://<your-project-ref>.supabase.co)."
    );
  }
  if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    throw new Error(
      "ServerClient: NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured correctly. Please check your .env.local file and ensure it contains your actual Supabase project anon key."
    );
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

export function createSupabaseServerActionClient() {
    const cookieStore = cookies()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || !supabaseUrl.startsWith('http')) {
      throw new Error(
        "ServerActionClient: NEXT_PUBLIC_SUPABASE_URL is not configured correctly or is invalid. Please check your .env.local file and ensure it contains your actual Supabase project URL (e.g., https://<your-project-ref>.supabase.co)."
      );
    }
    if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
      throw new Error(
        "ServerActionClient: NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured correctly. Please check your .env.local file and ensure it contains your actual Supabase project anon key."
      );
    }
    
    return createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: "", ...options });
                },
            },
        }
    );
}
