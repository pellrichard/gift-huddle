'use client';
import React, { useState } from "react";
import { CalendarDays, ListChecks, Plus, Pencil, Gift, ChevronRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EditProfileModal } from "@/components/account/EditProfileModal";
import { saveProfile } from "@/actions/profile";

const mockEvents = [
  { id: "1", title: "Mum's Birthday", date: "2025-10-04", icon: <Gift className="h-4 w-4" /> },
  { id: "2", title: "Secret Santa Reveal", date: "2025-12-14", icon: <Sparkles className="h-4 w-4" /> },
  { id: "3", title: "Anniversary", date: "2026-01-22", icon: <Gift className="h-4 w-4" /> },
];
const mockLists = [
  { id: "wl-1", name: "Christmas 2025", items: 14, reserved: 5 },
  { id: "wl-2", name: "Alex – Personal", items: 9, reserved: 2 },
  { id: "wl-3", name: "Dad 70th", items: 6, reserved: 1 },
];
const mockPriceWatch = [
  { id: "pw-1", title: "Bose QuietComfort Ultra", list: "Christmas 2025", url: "#", image: "/images/items/bose.png", baseline: 349.0, current: 299.0, shop: "Amazon", percentOff: 14.3 },
  { id: "pw-2", title: "LEGO Millennium Falcon", list: "Dad 70th", url: "#", image: "/images/items/lego.png", baseline: 149.99, current: 119.99, shop: "LEGO", percentOff: 20.0 },
];
const mockSuggestions = [
  { id: "s-1", title: "Whisky Tasting Set", tag: "Spirits", image: "/images/suggest/whisky.png" },
  { id: "s-2", title: "Custom Photo Book", tag: "Personalised", image: "/images/suggest/photobook.png" },
  { id: "s-3", title: "Wireless Meat Thermometer", tag: "Cooking", image: "/images/suggest/thermo.png" },
];

function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="flex items-center gap-2">{right}</div>
    </div>
  );
}

export default function AccountDashboard(props: {
  user: { name: string; avatar?: string | null };
  initialProfile?: {
    full_name: string | null;
    dob: string | null;
    show_dob_year: boolean | null;
    notify_mobile: boolean | null;
    notify_email: boolean | null;
    unsubscribe_all: boolean | null;
    preferred_currency: string | null;
    avatar_url: string | null;
    email: string | null;
  };
}) {
  const { user, initialProfile } = props;
  const [eventsView, setEventsView] = useState<'list' | 'calendar'>('list');
  const [openEdit, setOpenEdit] = useState(false);

  const initials = (user.name || 'U')
    .split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase();

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 font-sans">
      <Card className="mb-6 overflow-hidden">
        <CardContent className="flex flex-col items-start gap-4 bg-gradient-to-r from-[var(--gh-gradient-from)] to-[var(--gh-gradient-to)] p-6 sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16 ring-2 ring-white">
            <AvatarImage src={user.avatar ?? undefined} alt={user.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-xl font-semibold">Welcome back, {user.name?.split(' ')[0] ?? 'Friend'}!</div>
            <div className="text-sm text-muted-foreground">Here’s a snapshot of your gifting world.</div>
          </div>
          <Button variant="secondary" className="gap-2" onClick={() => setOpenEdit(true)}>
            <Pencil className="h-4 w-4" /> Edit profile
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming events */}
      <section className="mb-8">
        <SectionHeader
          title="Upcoming events"
          right={
            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border p-1 sm:flex">
                <Button size="sm" variant={eventsView === 'list' ? 'default' : 'ghost'} className="gap-2" onClick={() => setEventsView('list')}>
                  <ListChecks className="h-4 w-4" /> List
                </Button>
                <Button size="sm" variant={eventsView === 'calendar' ? 'default' : 'ghost'} className="gap-2" onClick={() => setEventsView('calendar')}>
                  <CalendarDays className="h-4 w-4" /> Calendar
                </Button>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add event
              </Button>
            </div>
          }
        />
        <div className="grid gap-3">
          {mockEvents.map((e) => (
            <Card key={e.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-muted p-2">{e.icon ?? <Gift className="h-4 w-4" />}</div>
                  <div>
                    <div className="font-medium">{e.title}</div>
                    <div className="text-sm text-muted-foreground">{new Date(e.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                </div>
                <Button variant="ghost" className="gap-2">View <ChevronRight className="h-4 w-4" /></Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* My Lists */}
      <section className="mb-8">
        <SectionHeader title="My lists" right={<Input placeholder="Search lists…" className="h-9 w-48" />} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockLists.map((l) => (
            <Card key={l.id} className="group">
              <CardContent className="p-4">
                <div className="mb-1 flex items-center justify-between">
                  <div className="font-medium">{l.name}</div>
                  <Badge variant="secondary" className="group-hover:scale-105 bg-[var(--gh-primary-50)] text-[var(--gh-primary-700)]">{l.items} items</Badge>
                </div>
                <div className="text-sm text-muted-foreground">{l.reserved} reserved</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Price Watch */}
      <section className="mb-8">
        <SectionHeader title="Price watch" right={<div className="text-sm text-muted-foreground">Tracking discounts across your lists</div>} />
        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2 pr-4">Item</th><th className="py-2 pr-4">List</th><th className="py-2 pr-4">Shop</th><th className="py-2 pr-4">Baseline</th><th className="py-2 pr-4">Current</th><th className="py-2 pr-4">Change</th>
              </tr>
            </thead>
            <tbody>
              {mockPriceWatch.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="py-3 pr-4">
                    <a href={p.url} className="flex items-center gap-3 hover:underline">
                      <Image src={p.image} alt="" width={40} height={40} className="h-10 w-10 rounded object-cover" />
                      <span className="font-medium">{p.title}</span>
                    </a>
                  </td>
                  <td className="py-3 pr-4">{p.list}</td><td className="py-3 pr-4">{p.shop}</td>
                  <td className="py-3 pr-4">£{p.baseline.toFixed(2)}</td><td className="py-3 pr-4 font-medium">£{p.current.toFixed(2)}</td>
                  <td className="py-3 pr-4"><Badge variant="default" className="bg-[var(--gh-primary-600)] text-white">-{p.percentOff.toFixed(0)}%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Suggestions */}
      <section className="mb-10">
        <SectionHeader title="Suggestions for you" right={<Button variant="outline" size="sm">Refresh</Button>} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockSuggestions.map((s) => (
            <Card key={s.id} className="overflow-hidden">
              <Image src={s.image} alt="" width={600} height={240} className="h-36 w-full object-cover" />
              <CardContent className="flex items-center justify-between p-4">
                <div><div className="font-medium">{s.title}</div><div className="text-xs text-muted-foreground">{s.tag}</div></div>
                <Button variant="secondary" size="sm">View</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Modal (prefilled with server data if available) */}
      <EditProfileModal
        open={openEdit}
        onOpenChange={setOpenEdit}
        initial={initialProfile ?? { full_name: user.name, avatar_url: user.avatar ?? null, preferred_currency: 'GBP', notify_email: true, notify_mobile: false, unsubscribe_all: false, dob: null, show_dob_year: true, email: null }}
        onSave={saveProfile}
      />
    </div>
  );
}
