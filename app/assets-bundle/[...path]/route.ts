import { NextRequest } from "next/server";
import { resolve } from "path";
import { promises as fs } from "fs";

export const runtime = "nodejs";

const BASE = resolve(process.cwd(), "assets-bundle");

export async function GET(_req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const rel = (path ?? []).join("/");
  const full = resolve(BASE, rel);

  // Prevent directory traversal
  if (!full.startsWith(BASE)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await fs.readFile(full); // Buffer (Node)
    // Force an ArrayBuffer copy so types can't be SharedArrayBuffer
    const ab = new ArrayBuffer(file.byteLength);
    new Uint8Array(ab).set(file);

    const ext = full.split(".").pop()?.toLowerCase();
    const type =
      ext === "svg" ? "image/svg+xml" :
      ext === "png" ? "image/png" :
      (ext === "jpg" || ext === "jpeg") ? "image/jpeg" :
      "application/octet-stream";

    const blob = new Blob([ab], { type });
    return new Response(blob, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
