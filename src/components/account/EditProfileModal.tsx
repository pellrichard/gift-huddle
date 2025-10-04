'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from '@/components/ui/modal';

type ProfileData = {
  display_name?: string | null;
  avatar_url?: string | null;
  dob?: string | null; // YYYY-MM-DD
  dob_show_year?: boolean | null;
  interests?: string[] | null;
  preferred_shops?: string[] | null;
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
    interests: initial?.interests ?? [],
    preferred_shops: initial?.preferred_shops ?? [],
  });
  const [tagInput, setTagInput] = React.useState('');
  const [shopInput, setShopInput] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setForm({
      display_name: initial?.display_name ?? '',
      avatar_url: initial?.avatar_url ?? '',
      dob: initial?.dob ?? '',
      dob_show_year: initial?.dob_show_year ?? true,
      interests: initial?.interests ?? [],
      preferred_shops: initial?.preferred_shops ?? [],
    });
    setTagInput('');
    setShopInput('');
  }, [open, initial]);

  const addTag = () => {
    const v = tagInput.trim();
    if (!v) return;
    setForm((f) => ({ ...f, interests: [...(f.interests ?? []), v] }));
    setTagInput('');
  };
  const removeTag = (i: number) => {
    setForm((f) => ({ ...f, interests: (f.interests ?? []).filter((_, idx) => idx !== i) }));
  };
  const addShop = () => {
    const v = shopInput.trim();
    if (!v) return;
    setForm((f) => ({ ...f, preferred_shops: [...(f.preferred_shops ?? []), v] }));
    setShopInput('');
  };
  const removeShop = (i: number) => {
    setForm((f) => ({ ...f, preferred_shops: (f.preferred_shops ?? []).filter((_, idx) => idx !== i) }));
  };

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

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <ModalTitle>Edit profile</ModalTitle>
        <ModalDescription>Update how your name and avatar appear to others.</ModalDescription>
      </ModalHeader>
      <ModalBody>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[112px_1fr]">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-24 w-24 ring-2 ring-white shadow">
              <AvatarImage src={form.avatar_url ?? undefined} alt={form.display_name ?? ''} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <Input
              placeholder="Avatar URL"
              value={form.avatar_url ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, avatar_url: e.target.value }))}
            />
          </div>

          {/* Basics */}
          <div className="grid gap-3">
            <div className="grid gap-1">
              <label htmlFor="display_name" className="text-sm font-medium">Display name</label>
              <Input
                id="display_name"
                placeholder="Your name"
                value={form.display_name ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 items-center gap-3">
              <div className="grid gap-1">
                <label htmlFor="dob" className="text-sm font-medium">Date of birth</label>
                <Input
                  id="dob"
                  type="date"
                  value={form.dob ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, dob: e.target.value }))}
                />
              </div>
              <label className="mt-6 inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!form.dob_show_year}
                  onChange={(e) => setForm((f) => ({ ...f, dob_show_year: e.target.checked }))}
                />
                Show birth year
              </label>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div className="mt-5 grid gap-2">
          <div className="text-sm font-medium">Interests</div>
          <div className="flex flex-wrap gap-2">
            {(form.interests ?? []).map((t, i) => (
              <Badge key={i} className="gap-1">
                {t}
                <button
                  type="button"
                  aria-label="Remove"
                  className="ml-1 text-xs opacity-70 hover:opacity-100"
                  onClick={() => removeTag(i)}
                >
                  ✕
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add an interest (e.g., Coffee)"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' ? (e.preventDefault(), addTag()) : undefined}
            />
            <Button type="button" onClick={addTag}>Add</Button>
          </div>
        </div>

        {/* Preferred shops */}
        <div className="mt-5 grid gap-2">
          <div className="text-sm font-medium">Preferred shops</div>
          <div className="flex flex-wrap gap-2">
            {(form.preferred_shops ?? []).map((t, i) => (
              <Badge key={i} className="gap-1">
                {t}
                <button
                  type="button"
                  aria-label="Remove"
                  className="ml-1 text-xs opacity-70 hover:opacity-100"
                  onClick={() => removeShop(i)}
                >
                  ✕
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a shop (e.g., Amazon)"
              value={shopInput}
              onChange={(e) => setShopInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' ? (e.preventDefault(), addShop()) : undefined}
            />
            <Button type="button" onClick={addShop}>Add</Button>
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
