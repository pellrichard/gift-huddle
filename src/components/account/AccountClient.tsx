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

// ---- mock data (replace with Supabase) ----
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

// ---- helpers ----
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

// --- Edit Profile Modal ---
type EditPayload = {
  name: string;
  dob: string | null;
  currency: string;
  notify: "email" | "push" | "none";
  // fine-grain flags if you later support multiple channels
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
    currency: string;
    // convert this into checkboxes in UI
    notify: "email" | "push" | "none";
    categories: string[];
    shops: string[];
  };
  onSave: (v: EditPayload) => void;
}) {
  const [name, setName] = useState(initial.name);
  const [dob, setDob] = useState<string>(initial.dob || "");
  const [currency, setCurrency] = useState(initial.currency);

  // Checkbox-style notification state
  const [notifyEmail, setNotifyEmail] = useState(initial.notify === "email");
  const [notifyPush, setNotifyPush] = useState(initial.notify === "push");
  const [notifyNone, setNotifyNone] = useState(initial.notify === "none");

  const [categories, setCategories] = useState<string[]>(initial.categories);
  const [shops, setShops] = useState<string[]>(initial.shops);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarName, setAvatarName] = useState<string>("");

  const allCategories = ["Tech", "Toys", "Books", "Spirits", "Cooking"];
  const allShops = ["Amazon", "LEGO", "John Lewis", "Etsy"];

  const toggle = (arr: string[], setArr: (v: string[]) => void, item: string) => {
    setArr(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item]);
  };

  const sortedCats = useMemo(() => {
    return [...allCategories].sort((a, b) => {
      const sa = categories.includes(a) ? 0 : 1;
      const sb = categories.includes(b) ? 0 : 1;
      return sa - sb;
    });
  }, [allCategories, categories]);

  const sortedShops = useMemo(() => {
    return [...allShops].sort((a, b) => {
      const sa = shops.includes(a) ? 0 : 1;
      const sb = shops.includes(b) ? 0 : 1;
      return sa - sb;
    });
  }, [allShops, shops]);

  // Checkbox rules
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

  // Derive single notify channel for current schema (choose priority)
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
          {/* Avatar + file button */}
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={initial.avatarUrl || ""} alt={name} />
              <AvatarFallback>{(name || "").split(" ").map((p) => p[0]).slice(0, 2).join("") || "GH"}</AvatarFallback>
            </Avatar>
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

          {/* Display name */}
          <div>
            <label className="text-sm font-medium">Display name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>

          {/* DOB + currency */}
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
                onChange={(e) => setCurrency(e.target.value)}
              >
                {["GBP", "USD", "EUR"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notify me (checkbox list) */}
          <div>
            <label className="text-sm font-medium">Notify me via</label>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => onToggleEmail(e.target.checked)}
                />
                <span>Email</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifyPush}
                  onChange={(e) => onTogglePush(e.target.checked)}
                />
                <span>Push</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={notifyNone}
                  onChange={(e) => onToggleNone(e.target.checked)}
                />
                <span>None</span>
              </label>
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="text-sm font-medium">Interests</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {sortedCats.map((c) => (
                <Chip
                  key={c}
                  active={categories.includes(c)}
                  onClick={() => toggle(categories, setCategories, c)}
                >
                  {c}
                </Chip>
              ))}
            </div>
          </div>

          {/* Preferred shops */}
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

          {/* Actions */}
          <div className="mt-2 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                onSave({
                  name,
                  dob: dob || null,
                  currency,
                  notify: notifyValue,
                  notifyEmail,
                  notifyPush,
                  categories,
                  shops,
                  avatarFile,
                })
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
      <Card className="mb-8 overflow-hidden">
        <CardContent className="flex flex-col items-start gap-5 bg-gradient-to-r from-[var(--gh-gradient-from)] to-[var(--gh-gradient-to)] p-6 sm:flex-row sm:items-center">
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

      {/* Example sections (placeholder headers remain) */}
      <SectionHeader title="Upcoming events" right={
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border p-1 sm:flex">
            <Button
              size="sm"
              variant={eventsView === "list" ? "default" : "ghost"}
              className="gap-2"
              onClick={() => setEventsView("list")}
            >
              <ListChecks className="h-4 w-4" /> List
            </Button>
            <Button
              size="sm"
              variant={eventsView === "calendar" ? "default" : "ghost"}
              className="gap-2"
              onClick={() => setEventsView("calendar")}
            >
              <CalendarDays className="h-4 w-4" /> Calendar
            </Button>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add event
          </Button>
        </div>
      } />
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
          categories: ["Tech", "Spirits"],
          shops: ["Amazon"],
        }}
        onSave={handleSave}
      />
    </div>
  );
}
