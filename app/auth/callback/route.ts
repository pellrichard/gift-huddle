import { upsertProfileFromAuth } from '@/actions/profile';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const next = url.searchParams.get('next') ?? '/account';
  const result = await upsertProfileFromAuth();

  if (!result?.ok) {
    return Response.redirect(new URL('/login?error=auth', url.origin));
  }

  const dest = result.needsOnboarding ? '/onboarding' : next;
  return Response.redirect(new URL(dest, url.origin));
}
