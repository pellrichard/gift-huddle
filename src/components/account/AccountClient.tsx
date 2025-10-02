"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  ListChecks,
  Plus,
  Pencil,
  Gift,
  Tag,
  ChevronRight,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type AccountClientProps = {
  displayName?: string;
  avatarUrl?: string | null;
};

// --- mock data (replace with Supabase) ---
const mockEvents = [
  { id: "1", title: "Mum's Birthday", date: "2025-10-04", icon: <Gift className="h-4 w-4" /> },
  { id: "2", title: "Secret Santa Reveal", date: "2025-12-14", icon: <Sparkles className="h-4 w-4" /> },
];
const mockLists = [
  { id: "wl-1", name: "Christmas 2025", items: 14, reserved: 5 },
  { id: "wl-2", name: "Alex – Personal", items: 9, reserved: 2 },
];
const mockPriceWatch = [
  {
    id: "pw-1",
    title: "Bose QuietComfort Ultra",
    list: "Christmas 2025",
    url: "#",
    image: "/images/items/bose.png",
    baseline: 349.0,
    current: 299.0,
    shop: "Amazon",
    percentOff: 14.3,
  },
];
const mockSuggestions = [
  { id: "s-1", title: "Whisky Tasting Set", tag: "Spirits", image: "/images/suggest/whisky.png" },
];

// --- helpers ---
function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  subtitle,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  cta?: React.ReactNode;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
        <div className="rounded-2xl p-3 shadow-sm bg-[var(--gh-primary-50)] text-[var(--gh-primary-700)]">{icon}</div>
        <div className="text-base font-medium">{title}</div>
        {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
        {cta}
      </CardContent>
    </Card>
  );
}

function Chip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition ${
        active
          ? "bg-[var(--gh-primary-50)] text-[var(--gh-primary-700)] border-transparent"
          : "hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

// --- Edit Profile Modal ---
type EditPayload = {
  name: string;
  dob: string | null;
  currency: string;
  notify: "email" | "push" | "none";
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
    currency: string;
    notify: "email" | "push" | "none";
    categories: string[];
    shops: string[];
  };
  onSave: (v: EditPayload) => void;
}) {
  const [name, setName] = useState(initial.name);
  const [dob, setDob] = useState<string>(initial.dob || "");
  const [currency, setCurrency] = useState(initial.currency);
  const [notify, setNotify] = useState<"email" | "push" | "none">(initial.notify);
  const [categories, setCategories] = useState<string[]>(initial.categories);
  const [shops, setShops] = useState<string[]>(initial.shops);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const allCategories = ["Tech", "Toys", "Books", "Spirits", "Cooking"];
  const allShops = ["Amazon", "LEGO", "John Lewis", "Etsy"];

  const toggle = (arr: string[], setArr: (v: string[]) => void, item: string) =>
    setArr(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit profile</h3>
          <button onClick={onClose} className="rounded p-1 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={initial.avatarUrl || ""} alt={name} />
              <AvatarFallback>{name.charAt(0) || "GH"}</AvatarFallback>
            </Avatar>
            <div>
              <label className="text-sm font-medium">Avatar</label>
              <Input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          {/* Display name */}
          <div>
            <label className="text-sm font-medium">Display name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          {/* DOB + currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date of birth</label>
              <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Preferred currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm">
                {["GBP", "USD", "EUR"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notify */}
          <div>
            <label className="text-sm font-medium">Notify me via</label>
            <div className="mt-2 flex gap-2">
              {(["email", "push", "none"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setNotify(opt)}
                  className={`rounded-lg border px-3 py-1.5 text-sm capitalize ${
                    notify === opt ? "bg-[var(--gh-primary-50)] text-[var(--gh-primary-700)]" : "hover:bg-gray-50"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="text-sm font-medium">Interests</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {allCategories.map((c) => (
                <Chip key={c} active={categories.includes(c)} onClick={() => toggle(categories, setCategories, c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </div>

          {/* Shops */}
          <div>
            <label className="text-sm font-medium">Preferred shops</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {allShops.map((s) => (
                <Chip key={s} active={shops.includes(s)} onClick={() => toggle(shops, setShops, s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                onSave({ name, dob, currency, notify, categories, shops, avatarFile })
              }
            >
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Account Page (client) ---
export default function AccountClient({ displayName, avatarUrl }: AccountClientProps) {
  const [eventsView, setEventsView] = useState<"list" | "calendar">("list");
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [editing, setEditing] = useState(false);

  const name = displayName || "Alex Johnson";
  const avatar = avatarUrl || "/images/mock-avatar.png";

  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(calendarMonth),
    [calendarMonth]
  );

  function handleSave(values: EditPayload) {
    console.log("TODO: save profile", values);
    setEditing(false);
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 font-sans">
      {/* Banner */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="flex flex-col items-start gap-4 bg-gradient-to-r from-[var(--gh-gradient-from)] to-[var(--gh-gradient-to)] p-6 sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16 ring-2 ring-white">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.charAt(0) || "GH"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-xl font-semibold">Welcome back, {name.split(" ")[0]}!</div>
            <div className="text-sm text-muted-foreground">Here’s a snapshot of your gifting world.</div>
          </div>
          <Button variant="secondary" className="gap-2" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" /> Edit profile
          </Button>
        </CardContent>
      </Card>

      {/* Example sections (events, lists, price watch, suggestions) */}
      <SectionHeader title="Upcoming events" />
      <SectionHeader title="My lists" />
      <SectionHeader title="Price watch" />
      <SectionHeader title="Suggestions for you" />

      {/* Modal */}
      <EditProfileModal
        open={editing}
        onClose={() => setEditing(false)}
        initial={{
          name,
          dob: "",
          avatarUrl: avatar,
          currency: "GBP",
          notify: "email",
          categories: ["Tech"],
          shops: ["Amazon"],
        }}
        onSave={handleSave}
      />
    </div>
  );
}
