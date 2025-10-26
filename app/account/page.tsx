
"use client";

import { useMemo } from "react";
import { Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockUser = {
  name: "Richard Pell",
  avatar: "/images/mock-avatar.png",
};

const mockEvents = [
  { id: "1", title: "Mum's Birthday", date: "2025-10-04" },
  { id: "2", title: "Secret Santa Reveal", date: "2025-12-14" },
];

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

function AccountPage() {
  const greeting = useMemo(() => {
    return `Welcome back, ${mockUser.name.split(" ")[0]}!`;
  }, []);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8 font-sans">
      <Card className="mb-6 overflow-hidden">
        <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <div className="text-xl font-semibold">{greeting}</div>
            <div className="text-sm text-muted-foreground">Here's a snapshot of your gifting world.</div>
          </div>
          <Button variant="secondary">Edit profile</Button>
        </CardContent>
      </Card>

      <section className="mb-8">
        <SectionHeader title="Upcoming events" />
        <div className="grid gap-3">
          {mockEvents.map((e) => (
            <Card key={e.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-muted p-2"><Gift className="h-4 w-4" /></div>
                  <div>
                    <div className="font-medium">{e.title}</div>
                    <div className="text-sm text-muted-foreground">{e.date}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AccountPage;
