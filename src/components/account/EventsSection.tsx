import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type EventRow = {
  id: string;
  title: string;
  date: string;
};

const supabase = createClient("", ""); // placeholder, adjust to your config

export default function EventsSection() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const today = new Date();

  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });
    if (!error && data) setEvents(data);
  }, [supabase]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents, supabase.auth]);

  const upcoming = useMemo(
    () => events.filter((e) => new Date(e.date) >= today),
    [events, today]
  );

  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        {upcoming.map((event) => (
          <li key={event.id}>{event.title} - {event.date}</li>
        ))}
      </ul>
    </div>
  );
}
