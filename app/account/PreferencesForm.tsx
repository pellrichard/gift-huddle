'use client';

import * as React from 'react';
import type { PreferencesPayload, NotifyChannel } from './actions';

type CategoriesProps = {
  interests?: {
    tech?: boolean;
    fashion?: boolean;
    beauty?: boolean;
    home?: boolean;
    toys?: boolean;
    // other dynamic keys are fine; we’ll read via bracket access
    [k: string]: boolean | undefined;
  };
  budget_monthly?: number | null;
  sizes?: { clothing?: string | null; shoes?: string | null } | null;
} | null;

type Props = {
  preferred_currency?: string | null;
  notify_channel?: NotifyChannel;
  categories?: CategoriesProps;
};

export default function PreferencesForm(props: Props) {
  const [status, setStatus] = React.useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [msg, setMsg] = React.useState<string>('');

  const [preferredCurrency, setPreferredCurrency] = React.useState<string>(props.preferred_currency || 'GBP');
  const [notifyChannel, setNotifyChannel] = React.useState<Exclude<NotifyChannel, null>>(
    (props.notify_channel ?? 'email') as Exclude<NotifyChannel, null>
  );

  const [cats, setCats] = React.useState<Record<string, boolean>>({
    tech: !!props.categories?.interests?.tech,
    fashion: !!props.categories?.interests?.fashion,
    beauty: !!props.categories?.interests?.beauty,
    home: !!props.categories?.interests?.home,
    toys: !!props.categories?.interests?.toys,
  });

  const [budget, setBudget] = React.useState<string>(
    props.categories?.budget_monthly != null ? String(props.categories?.budget_monthly) : ''
  );
  const [sizeClothing, setSizeClothing] = React.useState<string>(props.categories?.sizes?.clothing || '');
  const [sizeShoes, setSizeShoes] = React.useState<string>(props.categories?.sizes?.shoes || '');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setMsg('');
    const payload: PreferencesPayload = {
      preferred_currency: preferredCurrency,
      notify_channel: notifyChannel,
      categories: cats, // just the boolean interests
      budget_monthly: budget ? Number(budget) : null,
      sizes: { clothing: sizeClothing || null, shoes: sizeShoes || null },
    };
    const { savePreferences } = await import('./actions');
    const res = await savePreferences(payload);
    if (res.ok) {
      setStatus('saved');
      setMsg('Saved');
    } else {
      setStatus('error');
      setMsg(res.message ?? 'Failed to save');
    }
    setTimeout(() => setStatus('idle'), 1200);
  };

  const base = 'rounded-xl border bg-white px-4 py-2 text-sm';
  const label = 'text-sm font-medium text-gray-700';

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={label}>Preferred currency</label>
          <select
            className={`${base} w-full`}
            value={preferredCurrency}
            onChange={(e) => setPreferredCurrency(e.target.value)}
          >
            <option value="GBP">GBP £</option>
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
          </select>
        </div>
        <div>
          <label className={label}>Notify me via</label>
          <select
            className={`${base} w-full`}
            value={notifyChannel}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setNotifyChannel(e.target.value as 'email' | 'push' | 'none')
            }
          >
            <option value="email">Email</option>
            <option value="push">Push</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-gray-800">Interests</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {Object.entries({
            tech: 'Tech',
            fashion: 'Fashion',
            beauty: 'Beauty',
            home: 'Home & Decor',
            toys: 'Toys',
          }).map(([key, labelText]) => (
            <label key={key} className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!cats[key as keyof typeof cats]}
                onChange={(e) => setCats({ ...cats, [key]: e.target.checked })}
              />
              <span>{labelText}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className={label}>Monthly budget (£)</label>
          <input
            className={`${base} w-full`}
            inputMode="decimal"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. 100"
          />
        </div>
        <div>
          <label className={label}>Clothing size</label>
          <input
            className={`${base} w-full`}
            value={sizeClothing}
            onChange={(e) => setSizeClothing(e.target.value)}
            placeholder="S, M, L, 10, etc."
          />
        </div>
        <div>
          <label className={label}>Shoe size</label>
          <input
            className={`${base} w-full`}
            value={sizeShoes}
            onChange={(e) => setSizeShoes(e.target.value)}
            placeholder="UK 9, EU 42, etc."
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700 disabled:opacity-60"
          disabled={status === 'saving'}
        >
          {status === 'saving' ? 'Saving…' : 'Save preferences'}
        </button>
        {msg && <span className="text-sm text-gray-600">{msg}</span>}
      </div>
    </form>
  );
}
