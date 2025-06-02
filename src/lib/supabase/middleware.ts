
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL_HERE' || !supabaseUrl.startsWith('http')) {
    const errorMessage = `Middleware: NEXT_PUBLIC_SUPABASE_URL is not configured correctly or is invalid. Current value is: '${supabaseUrl}'. Please check your .env.local file and ensure it contains your actual Supabase project URL (e.g., https://<your-project-ref>.supabase.co). Also, ensure you have restarted your development server after changes to .env.local.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
  if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY_HERE') {
    const errorMessage = `Middleware: NEXT_PUBLIC_SUPABASE_ANON_KEY is not configured correctly. Current value is: '${supabaseAnonKey}'. Please check your .env.local file and ensure it contains your actual Supabase project anon key. Also, ensure you have restarted your development server after changes to .env.local.`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request cookies and response cookies
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request cookies and response cookies
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  await supabase.auth.getUser()

  return response
}
