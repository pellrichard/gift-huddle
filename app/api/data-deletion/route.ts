import { NextResponse } from "next/server";

/**
 * Optional: Data Deletion Callback URL (Facebook)
 * Accepts a POST with JSON body. You can expand this to verify signatures
 * and enqueue a real deletion job. For now we return a status URL and id.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const user_id = body?.user_id ?? null;

    // TODO: enqueue deletion task by user_id/email (server-side) if desired.

    return NextResponse.json({
      status: "received",
      user_id,
      // This should point to a user-visible page to check status. For now, reuse /data-deletion.
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/data-deletion`
    });
  } catch (e) {
    return NextResponse.json({ status: "error" }, { status: 400 });
  }
}
