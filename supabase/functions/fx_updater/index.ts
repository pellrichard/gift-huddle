// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type SymbolsResp = { symbols: Record<string, { description: string; code: string }> };
type LatestResp  = { base: string; date: string; rates: Record<string, number> };

const SUPABASE_URL  = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  global: { headers: { Authorization: `Bearer ${SERVICE_KEY}` } },
});

function cors(req: Request) {
  const origin = req.headers.get("origin") ?? "*";
  const acrh =
    req.headers.get("access-control-request-headers") ??
    "authorization,apikey,content-type,x-client-info";
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST,OPTIONS",
    "access-control-allow-headers": acrh,
  };
}

const json = (req: Request, body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      ...cors(req),
    },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers: cors(req) });

  try {
    const nowIso = new Date().toISOString();

    const body = await req.json().catch(() => ({} as any));
    const base = (typeof body?.base === "string" && body.base.length === 3
      ? body.base.toUpperCase()
      : "USD");

    const [symbolsRes, latestRes] = await Promise.all([
      fetch("https://api.exchangerate.host/symbols").then((r) => r.json()) as Promise<SymbolsResp>,
      fetch(`https://api.exchangerate.host/latest?base=${base}`).then((r) => r.json()) as Promise<LatestResp>,
    ]);

    const symbols = symbolsRes?.symbols ?? {};
    const { rates, date: effective_date, base: apiBase } = latestRes;

    if (!rates || !apiBase) {
      return json(req, { ok: false, error: "Invalid response from rates provider" }, 502);
    }

    const logPayload = { base: apiBase, effective_date, fetched_at: nowIso, rates };
    const { error: logErr } = await sb
      .from("fx_rates")
      .insert({
        base: apiBase,
        effective_date,
        payload: logPayload as any,
        source: "exchangerate.host",
      });

    if (logErr) {
      console.warn("fx_rates insert failed:", logErr);
    }

    const snapshot = Object.entries(rates).map(([code, rate]) => ({
      code: code.toUpperCase(),
      name: symbols?.[code]?.description ?? null,
      rate,
      base: apiBase,
      updated_at: nowIso,
    })) as any[];

    const { error: upsertErr, count } = await sb
      .from("currency_rates")
      .upsert(snapshot, { onConflict: "code", ignoreDuplicates: false, count: "exact" });

    if (upsertErr) {
      return json(req, { ok: false, error: upsertErr.message }, 500);
    }

    return json(req, {
      ok: true,
      base: apiBase,
      effective_date,
      updated_count: count ?? snapshot.length,
      codes: snapshot.length,
    });
  } catch (err) {
    console.error("fx_updater error:", err);
    return json(req, { ok: false, error: String(err) }, 500);
  }
});
