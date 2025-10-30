import { createRouteHandlerClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = await createRouteHandlerClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  const cookieStore = await cookies()

  return Response.json({
    session,
    user: session?.user ?? null,
    error,
    cookies: cookieStore.getAll(),
  })
}
