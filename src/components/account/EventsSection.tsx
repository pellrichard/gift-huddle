"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, CalendarDays } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabaseBrowser } from "@/lib/supabase/client";

type EventItem = {
  id: string;
  user_id: string;
  title: string;
  event_date: string; // YYYY-MM-DD
  event_type: "birthday" | "anniversary" | "holiday" | "other";
  notes?: string | null;
};

export default function EventsSection() {
  const supabase = supabaseBrowser();

  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<EventItem[]>([]);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<EventItem["event_type"]>("other");
  const [notes, setNotes] = useState("");

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });
    if (!error && data) setItems(data as EventItem[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
    // Re-fetch when auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange(() => fetchEvents());
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const add = async () => {
    if (!title || !date) return alert("Please enter a title and date");
    const { error } = await supabase.from("events").insert({
      title: title.slice(0, 140),
      event_date: date,
      event_type: type,
      notes: notes ? notes.slice(0, 1000) : null,
    });
    if (error) {
      alert(error.message || "Failed to add event (are you logged in?)");
      return;
    }
    setTitle(""); setDate(""); setType("other"); setNotes("");
    fetchEvents();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      alert(error.message || "Failed to delete event");
      return;
    }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const today = new Date();
  const upcoming = useMemo(() => {
    return items
      .filter(i => new Date(i.event_date) >= new Date(today.toDateString()))
      .slice(0, 10);
  }, [items]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" /> Upcoming events
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add form */}
        <div className="grid md:grid-cols-5 gap-3">
          <Input placeholder="Event title" value={title} onChange={e => setTitle(e.target.value)} />
          <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={type}
            onChange={e => setType(e.target.value as EventItem["event_type"])}
          >
            <option value="other">Other</option>
            <option value="birthday">Birthday</option>
            <option value="anniversary">Anniversary</option>
            <option value="holiday">Holiday</option>
          </select>
          <Input placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
          <Button onClick={add} className="gap-2 btn-accent"><Plus className="h-4 w-4" /> Add</Button>
        </div>

        {/* List */}
        {loading ? (
          <div>Loading…</div>
        ) : upcoming.length === 0 ? (
          <div className="text-sm text-gray-500">No upcoming events yet. Add one above!</div>
        ) : (
          <ul className="divide-y">
            {upcoming.map(ev => (
              <li key={ev.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className="bg-gray-100 text-gray-800 capitalize">{ev.event_type}</Badge>
                  <div>
                    <div className="font-medium">{ev.title}</div>
                    <div className="text-xs text-gray-500">{new Date(ev.event_date).toLocaleDateString()}</div>
                  </div>
                </div>
                <Button variant="ghost" onClick={() => remove(ev.id)} aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
