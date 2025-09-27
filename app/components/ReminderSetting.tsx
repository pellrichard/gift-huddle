'use client';
import { useState } from 'react';

export default function ReminderSetting(){
  const [enabled, setEnabled] = useState(true);
  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">Wishlist running low</div>
          <div className="text-sm text-gray-600">Notify me when a list has fewer than 3 unpurchased items.</div>
        </div>
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
          <span className="text-sm">{enabled ? 'On' : 'Off'}</span>
        </label>
      </div>
    </div>
  );
}
