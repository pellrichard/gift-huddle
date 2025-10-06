'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/modal';

type ProfileData = {
  full_name?: string | null;
  dob?: string | null;
  show_dob_year?: boolean | null;
  notify_mobile?: boolean | null;
  notify_email?: boolean | null;
  unsubscribe_all?: boolean | null;
  preferred_currency?: string | null;
  email?: string | null;
  avatar_url?: string | null;
};

type SaveResult = { ok: true } | { ok: false; error?: string } | void;

function initialsFrom(name?: string | null): string {
  const src = name ?? '';
  const parts = src.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  return parts.slice(0, 2).map(p => p[0]!.toUpperCase()).join('');
}

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  GB: 'GBP', IE: 'EUR', FR: 'EUR', DE: 'EUR', ES: 'EUR', PT: 'EUR', IT: 'EUR',
  NL: 'EUR', BE: 'EUR', LU: 'EUR', AT: 'EUR', FI: 'EUR', GR: 'EUR', CY: 'EUR',
  MT: 'EUR', SK: 'EUR', SI: 'EUR', LV: 'EUR', LT: 'EUR', EE: 'EUR',
  US: 'USD', CA: 'CAD', AU: 'AUD', NZ: 'NZD',
  CH: 'CHF', NO: 'NOK', SE: 'SEK', DK: 'DKK',
  PL: 'PLN', CZ: 'CZK', HU: 'HUF',
};

function regionFromLocale(locale?: string | null): string | null {
  if (!locale) return null;
  const m = locale.match(/[-_](\w{2})$/);
  return m ? m[1]!.toUpperCase() : null;
}

function guessCurrencyFromLocale(): string | null {
  try {
    const locales = Array.isArray(navigator.languages) && navigator.languages.length > 0
      ? navigator.languages
      : (navigator.language ? [navigator.language] : []);
    for (const loc of locales) {
      const region = regionFromLocale(loc);
      if (region && COUNTRY_TO_CURRENCY[region]) return COUNTRY_TO_CURRENCY[region];
    }
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      const loc = Intl.DateTimeFormat().resolvedOptions().locale;
      const region = regionFromLocale(loc);
      if (region && COUNTRY_TO_CURRENCY[region]) return COUNTRY_TO_CURRENCY[region];
    }
  } catch (e) {
    console.debug('[EditProfileModal] currency detect error', e);
  }
  return null;
}

export function EditProfileModal({
  open,
  onOpenChange,
  initial,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: ProfileData & { display_name?: string | null };
  onSave?: (data: ProfileData) => Promise<SaveResult> | SaveResult;
}) {
  const [form, setForm] = React.useState<ProfileData>({
    full_name: initial?.full_name ?? initial?.display_name ?? '',
    dob: initial?.dob ?? '',
    show_dob_year: initial?.show_dob_year ?? true,
    notify_mobile: initial?.notify_mobile ?? false,
    notify_email: initial?.notify_email ?? Boolean(initial?.email),
    unsubscribe_all: initial?.unsubscribe_all ?? false,
    preferred_currency: initial?.preferred_currency ?? 'GBP',
    email: initial?.email ?? null,
    avatar_url: initial?.avatar_url ?? null,
  });
  const [saving, setSaving] = React.useState(false);
  const requiredOk = Boolean(form?.dob && form?.preferred_currency);
  const [showRequiredBanner, setShowRequiredBanner] = React.useState(false);
  const [fxError, setFxError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    // Mirror latest props when opened
    setForm((prev) => ({
      ...prev,
      full_name: initial?.full_name ?? initial?.display_name ?? prev.full_name ?? '',
      dob: initial?.dob ?? prev.dob ?? '',
      show_dob_year: initial?.show_dob_year ?? prev.show_dob_year ?? true,
      notify_mobile: initial?.notify_mobile ?? prev.notify_mobile ?? false,
      notify_email: initial?.notify_email ?? prev.notify_email ?? Boolean(initial?.email),
      unsubscribe_all: initial?.unsubscribe_all ?? prev.unsubscribe_all ?? false,
      preferred_currency: initial?.preferred_currency ?? prev.preferred_currency ?? 'GBP',
      email: initial?.email ?? prev.email ?? null,
      avatar_url: initial?.avatar_url ?? prev.avatar_url ?? null,
    }));

    // Kick off server-side FX update (no CORS/JWT issues)
    (async () => {
      try {
        const r = await fetch('/api/fx/update', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ reason: 'EditProfileModal-open' }),
        });
        const bodyUnknown = await r.json().catch(() => ({}));
        const body = bodyUnknown as { ok?: boolean; error?: unknown };
        if (!r.ok || body?.ok === false) {
          const msg = body?.error ? String(body.error) : `HTTP ${r.status}`;
          setFxError(`FX update failed (server): ${msg}`);
        } else {
          setFxError(null);
        }
      } catch (e) {
        setFxError(`FX update failed (server network): ${String(e)}`);
      }
    })();
  }, [open, initial]);

  // Prefill currency for fresh users if missing
  React.useEffect(() => {
    if (!form?.preferred_currency) {
      const byLocale = guessCurrencyFromLocale();
      if (byLocale) {
        setForm((f) => ({ ...f, preferred_currency: byLocale }));
      }
    }
  }, [form?.preferred_currency]);

  const handleModalOpenChange = React.useCallback((nextOpen: boolean) => {
    if (!nextOpen && !requiredOk) {
      setShowRequiredBanner(true);
      return; // block close
    }
    onOpenChange(nextOpen);
  }, [requiredOk, onOpenChange]);

  const setField = <K extends keyof ProfileData>(k: K, v: ProfileData[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  async function handleSave() {
    if (!requiredOk) {
      setShowRequiredBanner(true);
      return;
    }
    setSaving(true);
    try {
      const res = await (onSave?.(form) ?? Promise.resolve({ ok: true } as SaveResult));
      if (res && typeof res === 'object' && 'ok' in res && (res as { ok: boolean }).ok === false) {
        alert((res as { error?: string }).error ?? 'Could not save profile.');
        return;
      }
      handleModalOpenChange(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const initials = initialsFrom(form.full_name ?? initial?.display_name ?? initial?.email ?? null);

  return (
    <Modal open={open} onOpenChange={handleModalOpenChange}>
      <ModalHeader>
        <ModalTitle>Edit profile</ModalTitle>
        <ModalDescription>Complete your profile so we can personalise your experience.</ModalDescription>
      </ModalHeader>
      <ModalBody>
        {!requiredOk && showRequiredBanner && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Please complete the required fields: <strong>Date of birth</strong> and <strong>Preferred currency</strong>.
          </div>
        )}
        {fxError && (
          <div className="mb-3 rounded-md border border-yellow-300 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
            {fxError}
          </div>
        )}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={initial?.avatar_url ?? undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="grid gap-1 w-full">
            <label htmlFor="full_name" className="text-sm font-medium">Full name</label>
            <Input
              id="full_name"
              placeholder="Your name"
              value={form.full_name ?? ''}
              onChange={(e) => setField('full_name', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 items-center gap-3">
          <div className="grid gap-1">
            <label htmlFor="dob" className="text-sm font-medium">Date of birth</label>
            <Input
              id="dob"
              type="date"
              value={form.dob ?? ''}
              onChange={(e) => setField('dob', e.target.value)}
              required
              aria-invalid={!form?.dob}
            />
          </div>

          <div className="grid gap-1">
            <label htmlFor="preferred_currency" className="text-sm font-medium">Preferred currency</label>
            <select
              id="preferred_currency"
              className="h-10 rounded-md border px-3"
              value={form.preferred_currency ?? ''}
              onChange={(e) => setField('preferred_currency', e.target.value || null)}
              required
              aria-invalid={!form?.preferred_currency}
            >
              <option value="" disabled>Select currency…</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="EUR">EUR — Euro</option>
              <option value="USD">USD — US Dollar</option>
            </select>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="secondary" size="lg" className="border w-full sm:w-auto px-4 py-2 rounded-md" onClick={() => handleModalOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="outline" size="lg" className="border w-full sm:w-auto px-4 py-2 rounded-md" onClick={handleSave} disabled={saving || !requiredOk}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
