
"use client";

import React, { useState } from "react";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AccountClientProps = {
  displayName?: string;
  avatarUrl?: string | null;
};

type Currency = "GBP" | "USD" | "EUR";
const ALL_CATEGORIES: string[] = ["Tech", "Toys", "Books", "Spirits", "Cooking"];
const ALL_SHOPS: string[] = ["Amazon", "LEGO", "John Lewis", "Etsy"];

function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition ${
        active
          ? "bg-[var(--gh-primary-50)] text-[var(--gh-primary-700)] border-transparent"
          : "border-muted-foreground/30 text-muted-foreground hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

type EditPayload = {
  name: string;
  dob: string | null;
  currency: Currency;
  notify: "email" | "push" | "none";
  notifyEmail: boolean;
  notifyPush: boolean;
  categories: string[];
  shops: string[];
  avatarFile: File | null;
};

function EditProfileModal({
  open,
  onClose,
  initial,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  initial: {
    name: string;
    dob?: string | null;
    avatarUrl?: string | null;
    currency: Currency;
    notify: "email" | "push" | "none";
    categories: string[];
    shops: string[];
  };
  onSave: (v: EditPayload) => void;
}) {
  const [name, setName] = useState(initial.name);
  const [dob, setDob] = useState<string>(initial.dob || "");
  const [currency, setCurrency] = useState<Currency>(initial.currency);
  const [notifyEmail, setNotifyEmail] = useState(initial.notify === "email");
  const [notifyPush, setNotifyPush] = useState(initial.notify === "push");
  const [notifyNone, setNotifyNone] = useState(initial.notify === "none");
  const [categories, setCategories] = useState<string[]>(initial.categories);
  const [shops, setShops] = useState<string[]>(initial.shops);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarName, setAvatarName] = useState<string>("");

  const toggle = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    setArr(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const sortedCats = [...ALL_CATEGORIES].sort((a, b) => {
    const sa = categories.includes(a) ? 0 : 1;
    const sb = categories.includes(b) ? 0 : 1;
    return sa - sb;
  });

  const sortedShops = [...ALL_SHOPS].sort((a, b) => {
    const sa = shops.includes(a) ? 0 : 1;
    const sb = shops.includes(b) ? 0 : 1;
    return sa - sb;
  });

  const onToggleNone = (checked: boolean) => {
    setNotifyNone(checked);
    if (checked) {
      setNotifyEmail(false);
      setNotifyPush(false);
    }
  };
  const onToggleEmail = (checked: boolean) => {
    setNotifyEmail(checked);
    if (checked) setNotifyNone(false);
  };
  const onTogglePush = (checked: boolean) => {
    setNotifyPush(checked);
    if (checked) setNotifyNone(false);
  };

  if (!open) return null;

  const notifyValue: "email" | "push" | "none" = notifyNone
    ? "none"
    : notifyEmail
    ? "email"
    : notifyPush
    ? "push"
    : "none";

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit profile</h3>
          <button aria-label="Close" onClick={onClose} className="rounded p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14">
              <div className="relative">
                <div className="rounded-full overflow-hidden h-14 w-14 border">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={initial.avatarUrl || ""} alt={name} />
                    <AvatarFallback>{(name || "").charAt(0) || "GH"}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Avatar</span>
              <input
                id="avatar-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setAvatarFile(f);
                  setAvatarName(f ? f.name : "");
                }}
              />
              <label htmlFor="avatar-file">
                <Button asChild variant="outline" size="sm">
                  <span>Choose file</span>
                </Button>
              </label>
              <span className="text-xs text-muted-foreground">{avatarName || "No file chosen"}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Display name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Date of birth</label>
              <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Preferred currency</label>
              <select
                className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                value={currency}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrency(e.target.value as Currency)}
              >
                {(["GBP", "USD", "EUR"] as const).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Notify me via</label>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={notifyEmail} onChange={(e) => onToggleEmail(e.target.checked)} />
                <span>Email</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={notifyPush} onChange={(e) => onTogglePush(e.target.checked)} />
                <span>Push</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={notifyNone} onChange={(e) => onToggleNone(e.target.checked)} />
                <span>None</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Interests</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {sortedCats.map((c) => (
                <Chip key={c} active={categories.includes(c)} onClick={() => toggle(categories, setCategories, c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Preferred shops</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {sortedShops.map((s) => (
                <Chip key={s} active={shops.includes(s)} onClick={() => toggle(shops, setShops, s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button className="bg-[var(--gh-primary-600)] text-white hover:bg-[var(--gh-primary-700)]" onClick={() =>
              onSave({ name, dob: dob || null, currency, notify: notifyValue, notifyEmail, notifyPush, categories, shops, avatarFile })
            }>Save changes</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountClient({ displayName, avatarUrl }: AccountClientProps) {
  const [editing, setEditing] = useState(false);
  const name = displayName || "Alex Johnson";
  const avatar = avatarUrl || "/images/mock-avatar.png";

  async function handleSave(values: EditPayload) {
    console.log("Would save", values);
    setEditing(false);
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 font-sans">
      <Card className="mb-8 overflow-hidden">
        <CardContent className="flex flex-col items-start gap-5 bg-gradient-to-r from-[var(--gh-gradient-from)] to-[var(--gh-gradient-to)] p-6 sm:flex-row sm:items-center">
          <div className="h-16 w-16">
            <div className="rounded-full overflow-hidden">
              <Avatar className="h-16 w-16 ring-2 ring-white">
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>{(name || "").charAt(0) || "GH"}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xl font-semibold">Welcome back, {name.split(" ")[0]}!</div>
            <div className="text-sm text-muted-foreground">Here’s a snapshot of your gifting world.</div>
          </div>
          <Button variant="secondary" className="gap-2" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" /> Edit profile
          </Button>
        </CardContent>
      </Card>

      <EditProfileModal
        open={editing}
        onClose={() => setEditing(false)}
        initial={{ name, dob: "", avatarUrl: avatar, currency: "GBP", notify: "email", categories: ["Tech"], shops: ["Amazon"] }}
        onSave={handleSave}
      />
    </div>
  );
}
