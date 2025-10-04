### 2025-10-04 – Cookie adapter: fix `expires` typing for Next.js

- Updated `CookieOptions.expires` to `number | Date` (no string) to match `NextResponse.cookies.set`.
- Build error resolved where `string | Date` conflicted with Next.js type.
