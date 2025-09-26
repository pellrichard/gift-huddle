# Gift Huddle – Data Deletion URL

This adds:
- `app/data-deletion/page.tsx` → Public instructions page for account/data deletion (use as your Facebook/LinkedIn "Data Deletion URL").
- `app/api/data-deletion/route.ts` → Optional POST endpoint stub suitable for Facebook's "Data Deletion Callback URL".

## How to use
1. Copy these files into your Next.js project (App Router).
2. Set `NEXT_PUBLIC_SITE_URL` in your environment (e.g., https://your-app.vercel.app) so the API returns a full status URL.
3. Deploy to Vercel.

## Where to paste in Facebook
- **Data Deletion URL (instructions):** `https://your-domain/data-deletion`
- **Data Deletion Callback URL (optional):** `https://your-domain/api/data-deletion`

You can enhance the API to:
- Verify the request signature from Facebook
- Look up the Supabase user and enqueue a deletion job
- Return a unique status page per request
