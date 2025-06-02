import { createSupabaseServerClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/' // Default redirect to home

  if (code) {
    const supabase = createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(requestUrl.origin + next)
    }
  }

  // return the user to an error page with instructions
  console.error('Auth callback error or no code provided.');
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=Could not authenticate user`);
}
