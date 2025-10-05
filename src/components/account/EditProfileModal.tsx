'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/modal';
import { supabase } from '@/lib/supabase/client';

function toStr(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  return undefined;
}

type ProfileData = {
  full_name?: string | null;
  dob?: string | null; // YYYY-MM-DD
  show_dob_year?: boolean | null;
  // Notifications
  notify_mobile?: boolean | null;
  notify_email?: boolean | null;
  unsubscribe_all?: boolean | null;
  // Preferences
  preferred_currency?: string | null;
};

type SaveResult = { ok: true } | { ok: false; error?: string } | void;

export function EditProfileModal({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ProfileData & { display_name?: string | null; dob_show_year?: boolean | null; email?: string | null; avatar_url?: string | null };
  onSave?: (data: ProfileData) => Promise<SaveResult> | SaveResult;
}) {
  const [form, setForm] = React.useState<ProfileData>({
    full_name: initial?.full_name ?? initial?.display_name ?? '',
    dob: initial?.dob ?? '',
    show_dob_year: initial?.show_dob_year ?? initial?.dob_show_year ?? true,
    notify_mobile: initial?.notify_mobile ?? false,
    notify_email: initial?.notify_email ?? true,
    unsubscribe_all: initial?.unsubscribe_all ?? false,
    preferred_currency: initial?.preferred_currency ?? 'GBP',
  });
  const [saving, setSaving] = React.useState(false);
  const [currencies, setCurrencies] = React.useState<Array<{ code: string; name: string }>>([]);
  const [loadingCurrencies, setLoadingCurrencies] = React.useState(true);
  const [fxError, setFxError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setFxError(null);
    setFxError(null);
    

    // DEV/BETA: Refresh fx rates by calling the edge function on modal open
    if (process.env.NEXT_PUBLIC_ENABLE_FX_AUTOUPDATE === "1" || process.env.NODE_ENV !== "production") {
      console.log('[fx_updater] invoking…');
                                                const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
                        const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
                        const fnUrl = `${baseUrl}/functions/v1/fx_updater`;
                        const payload = { reason: 'EditProfileModal-open', ts: new Date().toISOString() };
                        
                        supabase.functions
                          .invoke('fx_updater', {
                            body: payload,
                            headers: {
                              Authorization: `Bearer ${anon}`,
                              apikey: anon,
                            },
                          })
                          .then(({
                            data, error
                          }) => {
                            if (error) {
                              console.warn('[fx_updater] invoke error (will fallback)', error);
                              throw error;
                            }
                            setFxError(null);
                            console.log('[fx_updater] result', { ok: true, data });
                          })
                          .catch(async (err) => {
                            console.warn('[fx_updater] invoke fallback due to error', err);

                            try {
                              const r = await fetch(fnUrl, {
                                method: 'POST',
                                headers: {
                                  'content-type': 'application/json',
                                  Authorization: `Bearer ${anon}`,
                                  apikey: anon,
                                },
                                body: JSON.stringify(payload),
                              });
                              const body = await r.json().catch(() => ({}));
                              if (!r.ok || (typeof body?.ok !== 'undefined' && body.ok === false)) {
                                const msg = (body as { error?: string })?.error || `HTTP ${r.status}`;
                                setFxError(`FX update failed (fetch): ${msg}`);
                                console.error('[fx_updater] fetch failed', r.status, body);
                              } else {
                                setFxError(null);
                                console.log('[fx_updater] fetch result', body);
                              }
                              } catch (e) {
                                console.error('[fx_updater] network error', e);
                                setFxError(`FX update failed (network): ${String(e)}`);
                              }
                          });
}

        setForm({
      full_name: initial?.full_name ?? initial?.display_name ?? '',
      dob: initial?.dob ?? '',
      show_dob_year: initial?.show_dob_year ?? initial?.dob_show_year ?? true,
      notify_mobile: initial?.notify_mobile ?? false,
      notify_email: initial?.notify_email ?? true,
      unsubscribe_all: initial?.unsubscribe_all ?? false,
      preferred_currency: initial?.preferred_currency ?? 'GBP',
    });
  }, [open, initial]);

  // Load currency list from Supabase (fx_rates)
  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        const attempts: Array<ReadonlyArray<string>> = [
          ['code','name'],
          ['currency','name'],
          ['ccy','name'],
          ['code'],
          ['currency'],
          ['ccy'],
          ['base'],
          ['from_currency'],
          ['currency_code']
        ];
        // First try the new snapshot table (currency_rates). If present, use it; else fallback.
        try {
          const { data: cr, error: crErr } = await supabase
            .from('currency_rates')
            .select('code,name,updated_at')
            .limit(2000);
          if (!crErr && cr && (cr as unknown[]).length > 0) {
            const seen = new Set<string>();
            const norm = (cr as Array<{ code: string; name: string | null }>)
              .filter((c) => { if (!c?.code) return false; const up = c.code.toUpperCase(); if (seen.has(up)) return false; seen.add(up); return true; })
              .map((c) => ({ code: c.code.toUpperCase(), name: c.name ?? c.code.toUpperCase() }))
              .sort((a, b) => a.code.localeCompare(b.code));
            if (active) {
              setCurrencies(norm);
              setLoadingCurrencies(false);
            }
            return;
          }
        } catch { /* no-op */ } {
          // ignore and fallback to legacy fx_rates scan
        }
    
        let got: Array<{ code: string; name: string | undefined }> = [];
        for (const cols of attempts) {
          const sel = cols.join(',');
          const { data, error } = await supabase.from('fx_rates').select(sel).limit(2000);
          if (error) continue;
          if (data && (data as unknown[]).length > 0) {
            const rows = data as Array<Record<string, unknown>>;
            const list = rows
              .map((row) => {
                const code =
                  toStr(row['code']) ??
                  toStr(row['currency']) ??
                  toStr(row['ccy']) ??
                  toStr(row['base']) ??
                  toStr(row['from_currency']) ??
                  toStr(row['currency_code']);
                const name = toStr(row['name']);
                return code ? { code, name: name ?? undefined } : null;
              })
              .filter((x): x is { code: string; name: string | undefined } => Boolean(x));
            if (list.length > 0) {
              got = list;
              break;
            }
          }
        }
        if (active) {
          if (got.length === 0) {
            setCurrencies([
              { code: 'GBP', name: 'British Pound' },
              { code: 'EUR', name: 'Euro' },
              { code: 'USD', name: 'US Dollar' },
            ]);
          } else {
            const seen = new Set<string>();
            const norm = got
              .filter((c) => { if (seen.has(c.code)) return false; seen.add(c.code); return true; })
              .map((c) => ({ code: c.code, name: c.name ?? c.code }))
              .sort((a, b) => a.code.localeCompare(b.code));
            setCurrencies(norm);
          }
        }
      } catch {
        if (active) {
          setCurrencies([
            { code: 'GBP', name: 'British Pound' },
            { code: 'EUR', name: 'Euro' },
            { code: 'USD', name: 'US Dollar' },
          ]);
        }
      } finally {
        if (active) setLoadingCurrencies(false);
      }
    })();
    return () => { active = false; };
  }, []);

  function setField<K extends keyof ProfileData>(key: K, val: ProfileData[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      const res = (await onSave?.(form)) as SaveResult;
      if (!res || (typeof res === 'object' && 'ok' in res && res.ok === true)) {
        onOpenChange(false);
        return;
      }
      const message =
        typeof res === 'object' && res && 'error' in res && res.error
          ? res.error
          : 'Save failed';
      alert(message);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const initials = (initial?.full_name || initial?.display_name || initial?.email || 'U')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const disabledNotifs = !!form.unsubscribe_all;

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <ModalTitle>Edit profile</ModalTitle>
        <ModalDescription>Update your details and preferences.</ModalDescription>
      </ModalHeader>

      <ModalBody>
        {fxError && (
          <div className="w-full max-w-md mx-auto mb-3 text-sm rounded-md border border-red-200 bg-red-50 text-red-700 p-2">
            {fxError}
          </div>
        )}
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-24 w-24 ring-2 ring-white shadow">
            <AvatarImage src={initial?.avatar_url ?? undefined} alt={form.full_name ?? ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="w-full max-w-md grid gap-3">
            <div className="grid gap-1">
              <label htmlFor="full_name" className="text-sm font-medium">Display name</label>
              <Input
                id="full_name"
                placeholder="Your name"
                value={form.full_name ?? ''}
                onChange={(e) => setField('full_name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-3">
              <div className="grid gap-1">
                <label htmlFor="dob" className="text-sm font-medium">Date of birth</label>
                <Input
                  id="dob"
                  type="date"
                  value={form.dob ?? ''}
                  onChange={(e) => setField('dob', e.target.value)}
                />
              </div>
              <label className="mt-6 inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!form.show_dob_year}
                  onChange={(e) => setField('show_dob_year', e.target.checked)}
                />
                Show birth year
              </label>
            </div>

            {/* Notifications */}
            <div className="grid gap-2 rounded-lg border p-3">
              <div className="text-sm font-medium">Notifications</div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!form.unsubscribe_all}
                  onChange={(e) => {
                    const v = e.target.checked;
                    setForm(f => ({
                      ...f,
                      unsubscribe_all: v,
                      notify_mobile: v ? false : f.notify_mobile,
                      notify_email: v ? false : f.notify_email,
                    }));
                  }}
                />
                Unsubscribe from all
              </label>
              <div className="grid gap-1 pl-6">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!form.notify_mobile}
                    disabled={disabledNotifs}
                    onChange={(e) => setField('notify_mobile', e.target.checked)}
                  />
                  Mobile
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!form.notify_email}
                    disabled={disabledNotifs}
                    onChange={(e) => setField('notify_email', e.target.checked)}
                  />
                  Email
                </label>
              </div>
              {disabledNotifs && (
                <p className="pl-6 text-xs text-muted-foreground">You won’t receive notifications until you untick “Unsubscribe from all”.</p>
              )}
            </div>

            {/* Preferred currency */}
            <div className="grid gap-1">
              <label htmlFor="preferred_currency" className="text-sm font-medium">Preferred currency</label>
              <select
                id="preferred_currency"
                className="h-9 rounded-md border bg-white px-3 text-sm"
                value={form.preferred_currency ?? 'GBP'}
                onChange={(e) => setField('preferred_currency', e.target.value)}
                disabled={loadingCurrencies}
              >
                {loadingCurrencies ? (
                  <option>Loading…</option>
                ) : currencies.length === 0 ? (
                  <option>No currencies found</option>
                ) : (
                  currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} – {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto border px-4 py-2 rounded-md"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          variant="outline" size="lg"
          className="border w-full sm:w-auto px-4 py-2 rounded-md"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}