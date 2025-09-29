"use client";
import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Profile = {
  id: string;
  display_name: string;
  dob: string | null;        // ISO date (YYYY-MM-DD)
  dob_show_year: boolean;
  categories: string[];
  preferred_shops: string[];
  socials: Record<string, string>;
};

export default function ProfileForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setProfile({
          id: data.id,
          display_name: data.display_name ?? "",
          dob: data.dob ?? null,
          dob_show_year: !!data.dob_show_year,
          categories: data.categories ?? [],
          preferred_shops: data.preferred_shops ?? [],
          socials: data.socials ?? {},
        });
      }
      setLoading(false);
    })();
  }, []);

  const [displayName, setDisplayName] = useState("");
  const [dob, setDob] = useState<string | null>(null);
  const [dobShowYear, setDobShowYear] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [shops, setShops] = useState<string[]>([]);
  const [socials, setSocials] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name || "");
    setDob(profile.dob);
    setDobShowYear(!!profile.dob_show_year);
    setCategories(profile.categories || []);
    setShops(profile.preferred_shops || []);
    setSocials(profile.socials || {});
  }, [profile]);

  const addFromCommaInput = (value: string, setter: (arr: string[]) => void, arr: string[]) => {
    const parts = value.split(",").map((s) => s.trim()).filter(Boolean);
    const merged = Array.from(new Set([...arr, ...parts])).slice(0, 50);
    setter(merged);
  };

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        display_name: displayName,
        dob,
        dob_show_year: dobShowYear,
        categories,
        preferred_shops: shops,
        socials,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error || "Failed to save profile");
    }
  };

  if (loading || !profile) {
    return (
      <Card className="mb-8">
        <CardHeader><CardTitle>Profile & Preferences</CardTitle></CardHeader>
        <CardContent>Loading…</CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Profile & Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Display name</label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g., Alex Carter" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date of birth</label>
            <div className="flex items-center gap-3">
              <Input type="date" value={dob ?? ""} onChange={(e) => setDob(e.target.value || null)} className="max-w-xs" />
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!dobShowYear} onChange={(e) => setDobShowYear(!e.target.checked)} />
                Hide year
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">We’ll show only day & month on your public profile when “Hide year” is on.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Categories (comma-separated)</label>
            <Input placeholder="e.g., LEGO, running, whisky" onKeyDown={(e) => {
              if (e.key === 'Enter') addFromCommaInput((e.target as HTMLInputElement).value, setCategories, categories);
            }} />
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((c) => <Badge key={c} className="bg-gray-100 text-gray-800">{c}</Badge>)}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preferred shops (comma-separated)</label>
            <Input placeholder="e.g., Amazon, John Lewis, Argos" onKeyDown={(e) => {
              if (e.key === 'Enter') addFromCommaInput((e.target as HTMLInputElement).value, setShops, shops);
            }} />
            <div className="mt-2 flex flex-wrap gap-2">
              {shops.map((s) => <Badge key={s} className="bg-gray-100 text-gray-800">{s}</Badge>)}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Socials</label>
            <div className="space-y-2">
              <Input placeholder="Facebook URL" value={socials.facebook ?? ""} onChange={(e) => setSocials({ ...socials, facebook: e.target.value })} />
              <Input placeholder="Instagram URL" value={socials.instagram ?? ""} onChange={(e) => setSocials({ ...socials, instagram: e.target.value })} />
              <Input placeholder="X / Twitter URL" value={socials.twitter ?? ""} onChange={(e) => setSocials({ ...socials, twitter: e.target.value })} />
              <Input placeholder="Website" value={socials.website ?? ""} onChange={(e) => setSocials({ ...socials, website: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={save} disabled={saving} className="gap-2 btn-accent">
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save profile"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
