'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/modal';
import { supabase } from '@/lib/supabase/client';

type ProfileData = {
  display_name?: string | null;
  avatar_url?: string | null;
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
  initial?: ProfileData & { email?: string | null };
  onSave?: (data: ProfileData) => Promise<void> | void;
}) {
  const [form, setForm] = React.useState<ProfileData>({
    display_name: initial?.display_name ?? '',
    avatar_url: initial?.avatar_url ?? '',
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
      avatar_url: initial?.avatar_url ?? '',
      dob: initial?.dob ?? '',
      dob_show_year: initial?.dob_show_year ?? true,
      notify_mobile: initial?.notify_mobile ?? false,
      notify_email: initial?.notify_email ?? true,
      unsubscribe_all: initial?.unsubscribe_all ?? false,
      preferred_currency: initial?.preferred_currency ?? 'GBP',
    });
  }, [open, initial]);

React.useEffect(() => {
  let active = true;
  (async () => {
    try {
      const { data } = await supabase
        .from('currencies')
        .select('code,name')
        .order('code');
      if (active && data) {
        setCurrencies(data as Array<{ code: string; name: string }>);
      }
    } catch {
      // fallback if table not accessible: common currencies
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
    setForm(f => ({ ...f, [key]: val }));
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
        <ModalDescription>Update how your name and avatar appear to others.</ModalDescription>
      </ModalHeader>

      <ModalBody>
        {/* Avatar first */}
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-24 w-24 ring-2 ring-white shadow">
            <AvatarImage src={form.avatar_url ?? undefined} alt={form.display_name ?? ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          {/* All inputs stacked under picture */}
          <div className="w-full max-w-md grid gap-3">
            <div className="grid gap-1">
              <label htmlFor="avatar_url" className="text-sm font-medium">Avatar URL</label>
              <Input
                id="avatar_url"
                placeholder="https://…"
                value={form.avatar_url ?? ''}
                onChange={(e) => setField('avatar_url', e.target.value)}
              />
            </div>

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
                      // If unsubscribed from all, also turn off both channels
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

      <ModalFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
      </ModalFooter>
    </Modal>
  );
}
