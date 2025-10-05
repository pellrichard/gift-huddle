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

async function safeJson(url: string): Promise<unknown> {
  const r = await fetch(url);
  const text = await r.text().catch(() => "");
  try {
    const parsed = JSON.parse(text);
    if (!r.ok) {
      // Bubble up provider's error if present
      const err = (parsed && typeof parsed === "object" && "error" in parsed)
        ? (parsed as { error?: unknown }).error
        : text || `HTTP ${r.status}`;
      throw new Error(String(err));
    }
    return parsed;
  } catch (e) {
    if (!r.ok) throw new Error(text || `HTTP ${r.status}`);
    throw e;
  }
}

function normalizeFromExchangerateHost(j: any) {
  const base = typeof j?.base === "string" ? j.base : undefined;
  const date = typeof j?.date === "string" ? j.date : undefined;
  const rates = (j?.rates && typeof j.rates === "object") ? j.rates as Record<string, number> : undefined;
  return base && rates ? { base, date, rates } : null;
}

function normalizeFromFrankfurter(j: any) {
  // https://www.frankfurter.app/latest?from=USD
  const base = typeof j?.base === "string" ? j.base : undefined;
  const date = typeof j?.date === "string" ? j.date : undefined;
  const rates = (j?.rates && typeof j.rates === "object") ? j.rates as Record<string, number> : undefined;
  return base && rates ? { base, date, rates } : null;
}

function normalizeFromERAPI(j: any) {
  // https://open.er-api.com/v6/latest/USD
  if (j?.result !== "success") return null;
  const base = typeof j?.base_code === "string" ? j.base_code : undefined;
  const date = typeof j?.time_last_update_utc === "string" ? j.time_last_update_utc : undefined;
  const rates = (j?.rates && typeof j.rates === "object") ? j.rates as Record<string, number> : undefined;
  return base && rates ? { base, date, rates } : null;
}

async function fetchLatest(base: string) {
  // Try providers in order with graceful fallback
  // 1) exchangerate.host
  try {
    const j = await safeJson(`https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`);
    const norm = normalizeFromExchangerateHost(j);
    if (norm) return { provider: "exchangerate.host", ...norm };
    throw new Error("Unexpected schema from exchangerate.host");
  } catch (_e) {
    // 2) frankfurter.app
    try {
      const j = await safeJson(`https://api.frankfurter.app/latest?from=${encodeURIComponent(base)}`);
      const norm = normalizeFromFrankfurter(j);
      if (norm) return { provider: "frankfurter.app", ...norm };
      throw new Error("Unexpected schema from frankfurter.app");
    } catch (_e2) {
      // 3) open.er-api.com
      const j = await safeJson(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`);
      const norm = normalizeFromERAPI(j);
      if (norm) return { provider: "open.er-api.com", ...norm };
      throw new Error("Unexpected schema from open.er-api.com");
    }
  }
}

async function fetchSymbols(): Promise<Record<string, { description: string; code: string }>> {
  // Try exchangerate.host -> frankfurter -> fallback to empty (names = code)
  try {
    const j = await safeJson("https://api.exchangerate.host/symbols") as SymbolsResp;
    if (j && typeof j === "object" && "symbols" in j && j.symbols) return j.symbols;
  } catch {}
  try {
    const j = await safeJson("https://api.frankfurter.app/currencies") as Record<string,string>;
    const map: Record<string, { description: string; code: string }> = {};
    for (const [code, description] of Object.entries(j ?? {})) {
      map[code] = { code, description };
    }
    return map;
  } catch {}
  return {};
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("", { status: 204, headers: cors(req) });

  try {
    const nowIso = new Date().toISOString();

    const body = await req.json().catch(() => ({} as any));
    const base = (typeof body?.base === "string" && body.base.length === 3
      ? body.base.toUpperCase()
      : "USD");

    const [symbols, latest] = await Promise.all([
      fetchSymbols(),
      fetchLatest(base),
    ]);

    const { rates, date: effective_date, base: apiBase, provider } = latest as { rates: Record<string, number>, date?: string, base: string, provider: string };

    if (!rates || !apiBase) {
      return json(req, { ok: false, error: "Invalid response from rates provider" }, 502);
    }

    const logPayload = { base: apiBase, effective_date, fetched_at: nowIso, provider, sample: Object.fromEntries(Object.entries(rates).slice(0,5)) };
    const { error: logErr } = await sb
      .from("fx_rates")
      .insert({
        base: apiBase,
        effective_date,
        payload: logPayload as any,
        source: provider,
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
