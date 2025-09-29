"use client";
import React, { useMemo, useState } from "react";
import { CalendarDays, ListChecks, Plus, Pencil, Gift, Tag, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import ProfileForm from "./ProfileForm";
import ProfileSummary from "./ProfileSummary";

/**
 * Gift Huddle – My Account Page
 * -------------------------------------------------
 * Production-ready React component (Next.js + Tailwind + shadcn/ui)
 * BRAND/STYLING HOOKS
 * - Consumes CSS vars you define globally (e.g., styles/theme.css):
 *   --gh-primary-50/100/200/600/700
 *   --gh-surface
 *   --gh-gradient-from, --gh-gradient-to
 * - Respects your site font via Tailwind's font-sans (map to your Next.js font loader).
 *
 * Features
 * - Toggle Upcoming Events between List and Calendar view (+ Add event button)
 * - Top banner with avatar + Edit Profile
 * - My Lists summary (name, item count, reserved count)
 * - Price Watch table
 * - Suggestions grid
 */

// ---- Mock data (replace with live Supabase queries) ----
const mockUser = {
  name: "Alex Johnson",
  avatar: "/images/mock-avatar.png",
};

const mockEvents: { id: string; title: string; date: string; icon?: React.ReactNode }[] = [
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
  {
    id: "pw-2",
    title: "LEGO Millennium Falcon",
    list: "Dad 70th",
    url: "#",
    image: "/images/items/lego.png",
    baseline: 149.99,
    current: 119.99,
    shop: "LEGO",
    percentOff: 20.0,
  },
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

function EmptyState({ icon, title, subtitle, cta }: { icon: React.ReactNode; title: string; subtitle?: string; cta?: React.ReactNode }) {
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

function MiniCalendar({
  events,
  monthDate,
}: {
  events: { id: string; title: string; date: string; icon?: React.ReactNode }[];
  monthDate: Date;
}) {
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const days = Array.from({ length: end.getDate() }, (_, i) => new Date(monthDate.getFullYear(), monthDate.getMonth(), i + 1));
  const map = useMemo(() => {
    const m = new Map<string, { id: string; title: string; icon?: React.ReactNode }[]>();
    events.forEach((e) => {
      m.set(e.date, [...(m.get(e.date) || []), { id: e.id, title: e.title, icon: e.icon }]);
    });
    return m;
  }, [events]);

  const firstDow = start.getDay();
  const blanks = Array.from({ length: firstDow }, () => null);

  return (
    <div className="grid grid-cols-7 gap-2">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
        <div key={d} className="px-1 text-center text-xs font-medium text-muted-foreground">
          {d}
        </div>
      ))}
      {blanks.map((_, i) => (
        <div key={`b-${i}`} />
      ))}
      {days.map((d) => {
        const key = d.toISOString().slice(0, 10);
        const has = map.get(key);
        return (
          <Card key={key} className={"min-h-[84px]"}>
            <CardContent className="p-2">
              <div className="mb-1 text-xs font-semibold">{d.getDate()}</div>
              <div className="space-y-1">
                {has?.slice(0, 3).map((e) => (
                  <div key={e.id} className="flex items-center gap-1 truncate text-xs">
                    <span>{e.icon ?? <Gift className="h-3 w-3" />}</span>
                    <span className="truncate">{e.title}</span>
                  </div>
                ))}
                {has && has.length > 3 && <div className="text-[10px] text-muted-foreground">+{has.length - 3} more</div>}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function AccountPage() {
  const [eventsView, setEventsView] = useState<"list" | "calendar">("list");
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const monthLabel = useMemo(
    () => new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(calendarMonth),
    [calendarMonth]
  );

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 font-sans">
      {/* Top banner */}
      <Card className="mb-6 overflow-hidden">
        <CardContent className="flex flex-col items-start gap-4 bg-gradient-to-r from-[var(--gh-gradient-from)] to-[var(--gh-gradient-to)] p-6 sm:flex-row sm:items-center">
          <Avatar className="h-16 w-16 ring-2 ring-white">
            <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="text-xl font-semibold">Welcome back, {mockUser.name.split(" ")[0]}!</div>
            <div className="text-sm text-muted-foreground">Here’s a snapshot of your gifting world.</div>
          </div>
          <Button variant="secondary" className="gap-2">
            <Pencil className="h-4 w-4" /> Edit profile
          </Button>
        </CardContent>
      </Card>
      <ProfileForm />

      {/* Upcoming events */}
      <section className="mb-8">
        <SectionHeader
          title="Upcoming events"
          right={
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
          }
        />

        {mockEvents.length === 0 ? (
          <EmptyState
            icon={<CalendarDays className="h-6 w-6" />}
            title="No events yet"
            subtitle="Add birthdays, anniversaries, and occasions to plan ahead."
            cta={
              <Button className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                Add your first event
              </Button>
            }
          />
        ) : eventsView === "list" ? (
          <div className="grid gap-3">
            {mockEvents.map((e) => (
              <Card key={e.id}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-muted p-2">{e.icon ?? <Gift className="h-4 w-4" />}</div>
                    <div>
                      <div className="font-medium">{e.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(e.date).toLocaleDateString(undefined, {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" className="gap-2">
                    View <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-base">{monthLabel}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <MiniCalendar events={mockEvents} monthDate={calendarMonth} />
              <div className="flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                >
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCalendarMonth(new Date())}>
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* My Lists */}
      <section className="mb-8">
        <SectionHeader title="My lists" right={<Input placeholder="Search lists…" className="h-9 w-48" />} />
        {mockLists.length === 0 ? (
          <EmptyState
            icon={<ListChecks className="h-6 w-6" />}
            title="No lists yet"
            subtitle="Create a wishlist for yourself or for someone you’re gifting."
            cta={
              <Button className="mt-2">
                <Plus className="mr-2 h-4 w-4" />
                Create a list
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockLists.map((l) => (
              <Card key={l.id} className="group">
                <CardContent className="p-4">
                  <div className="mb-1 flex items-center justify-between">
                    <div className="font-medium">{l.name}</div>
                    <Badge className="group-hover:scale-105 bg-[var(--gh-primary-50)] text-[var(--gh-primary-700)]">{l.items} items</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{l.reserved} reserved</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Price Watch */}
      <section className="mb-8">
        <SectionHeader title="Price watch" right={<div className="text-sm text-muted-foreground">Tracking discounts across your lists</div>} />
        {mockPriceWatch.length === 0 ? (
          <EmptyState icon={<Tag className="h-6 w-6" />} title="No discounts right now" subtitle="We’ll surface items when the price drops." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2 pr-4">Item</th>
                  <th className="py-2 pr-4">List</th>
                  <th className="py-2 pr-4">Shop</th>
                  <th className="py-2 pr-4">Baseline</th>
                  <th className="py-2 pr-4">Current</th>
                  <th className="py-2 pr-4">Change</th>
                </tr>
              </thead>
              <tbody>
                {mockPriceWatch.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="py-3 pr-4">
                      <a href={p.url} className="flex items-center gap-3 hover:underline">
                        <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />
                        <span className="font-medium">{p.title}</span>
                      </a>
                    </td>
                    <td className="py-3 pr-4">{p.list}</td>
                    <td className="py-3 pr-4">{p.shop}</td>
                    <td className="py-3 pr-4">£{p.baseline.toFixed(2)}</td>
                    <td className="py-3 pr-4 font-medium">£{p.current.toFixed(2)}</td>
                    <td className="py-3 pr-4">
                      <Badge className="bg-[var(--gh-primary-600)] text-white">-{p.percentOff.toFixed(0)}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Suggestions */}
      <section className="mb-10">
        <SectionHeader title="Suggestions for you" right={<Button variant="outline" size="sm">Refresh</Button>} />
        {mockSuggestions.length === 0 ? (
          <EmptyState icon={<Sparkles className="h-6 w-6" />} title="No suggestions yet" subtitle="Tell us your interests to get started." />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockSuggestions.map((s) => (
              <Card key={s.id} className="overflow-hidden">
                <img src={s.image} alt="" className="h-36 w-full object-cover" />
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.tag}</div>
                  </div>
                  <Button variant="secondary" size="sm">View</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}