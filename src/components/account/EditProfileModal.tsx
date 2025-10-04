'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/modal';
import { supabase } from '@/lib/supabase/client';

// helper to coerce potential values to string safely
function toStr(v: unknown): string | undefined {
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  return undefined;
}

type ProfileData = {
  display_name?: string | null;
  dob?: string | null; // YYYY-MM-DD
  dob_show_year?: boolean | null;
  // Notifications
  notify_mobile?: boolean | null;
  notify_email?: boolean | null;
  unsubscribe_all?: boolean | null;
  // Preferences
  preferred_currency?: string | null;
};

export function EditProfileModal({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ProfileData & { email?: string | null; avatar_url?: string | null };
  onSave?: (data: ProfileData) => Promise<void> | void;
}) {
  const [form, setForm] = React.useState<ProfileData>({
    display_name: initial?.display_name ?? '',
    dob: initial?.dob ?? '',
    dob_show_year: initial?.dob_show_year ?? true,
    notify_mobile: initial?.notify_mobile ?? false,
    notify_email: initial?.notify_email ?? true,
    unsubscribe_all: initial?.unsubscribe_all ?? false,
    preferred_currency: initial?.preferred_currency ?? 'GBP',
  });
  const [saving, setSaving] = React.useState(false);
  const [currencies, setCurrencies] = React.useState<Array<{ code: string; name: string }>>([]);
  const [loadingCurrencies, setLoadingCurrencies] = React.useState(true);

  React.useEffect(() => {
    if (!open) return;
    setForm({
      display_name: initial?.display_name ?? '',
      dob: initial?.dob ?? '',
      dob_show_year: initial?.dob_show_year ?? true,
      notify_mobile: initial?.notify_mobile ?? false,
      notify_email: initial?.notify_email ?? true,
      unsubscribe_all: initial?.unsubscribe_all ?? false,
      preferred_currency: initial?.preferred_currency ?? 'GBP',
    });
  }, [open, initial]);

  // Load currency list from Supabase (fx_rates), handling schema variations
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
              // IMPORTANT: Use a compatible type predicate (no optional here)
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
              // here we force name to a definite string for state typing
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
      await onSave?.(form);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  }

  const initials = (initial?.display_name || initial?.email || 'U')
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
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-24 w-24 ring-2 ring-white shadow">
            <AvatarImage src={initial?.avatar_url ?? undefined} alt={form.display_name ?? ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="w-full max-w-md grid gap-3">
            <div className="grid gap-1">
              <label htmlFor="display_name" className="text-sm font-medium">Display name</label>
              <Input
                id="display_name"
                placeholder="Your name"
                value={form.display_name ?? ''}
                onChange={(e) => setField('display_name', e.target.value)}
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
                  checked={!!form.dob_show_year}
                  onChange={(e) => setField('dob_show_year', e.target.checked)}
                />
                Show birth year
              </label>
            </div>

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

      <ModalFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
      </ModalFooter>
    </Modal>
  );
}
