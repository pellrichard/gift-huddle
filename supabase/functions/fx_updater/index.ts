// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type SymbolsResp = { symbols: Record<string, { description: string; code: string }> };
type LatestResp  = { base: string; date: string; rates: Record<string, number> };

const SUPABASE_URL  = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CORS_ORIGIN   = "*"; // tighten if you want (e.g. https://www.gift-huddle.com)

const sb = createClient(SUPABASE_URL, SERVICE_KEY, {
  global: { headers: { Authorization: `Bearer ${SERVICE_KEY}` } },
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": CORS_ORIGIN,
      "access-control-allow-headers": "authorization,apikey,content-type",
      "access-control-allow-methods": "POST,OPTIONS",
    },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") return json({}, 204);

  try {
    const nowIso = new Date().toISOString();

    // You can override the base via body: { base: "GBP" }
    const body = await req.json().catch(() => ({} as any));
    const base = (typeof body?.base === "string" && body.base.length === 3
      ? body.base.toUpperCase()
      : "USD");

    // Fetch symbols and latest rates
    const [symbolsRes, latestRes] = await Promise.all([
      fetch("https://api.exchangerate.host/symbols").then((r) => r.json()) as Promise<SymbolsResp>,
      fetch(`https://api.exchangerate.host/latest?base=${base}`).then((r) => r.json()) as Promise<LatestResp>,
    ]);

    const symbols = symbolsRes?.symbols ?? {};
    const { rates, date: effective_date, base: apiBase } = latestRes;

    if (!rates || !apiBase) {
      return json({ ok: false, error: "Invalid response from rates provider" }, 502);
    }

    // 1) Append a log row (raw payload) into fx_rates
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
      // still continue; snapshot upsert is more important for UX
      console.warn("fx_rates insert failed:", logErr);
    }

    // 2) Build latest snapshot rows for currency_rates
    // rate semantics: "price of 1 BASE in this currency"
    const snapshot = Object.entries(rates).map(([code, rate]) => ({
      code: code.toUpperCase(),
      name: symbols[code]?.description ?? null,
      rate,
      base: apiBase,
      updated_at: nowIso,
    }));

    // Upsert latest per code
    const { error: upsertErr, count } = await sb
      .from("currency_rates")
      .upsert(snapshot, { onConflict: "code", ignoreDuplicates: false, count: "exact" });

    if (upsertErr) {
      return json({ ok: false, error: upsertErr.message }, 500);
    }

    return json({
      ok: true,
      base: apiBase,
      effective_date,
      updated_count: count ?? snapshot.length,
      codes: snapshot.length,
    });
  } catch (err) {
    console.error("fx_updater error:", err);
    return json({ ok: false, error: String(err) }, 500);
  }
});
