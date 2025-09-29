"use client";
import React, { useEffect, useState } from "react";
import { Globe, Instagram, Facebook, Twitter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabaseBrowser } from "@/lib/supabase/client";

type Profile = {
  id: string;
  display_name: string | null;
  categories: string[] | null;
  preferred_shops: string[] | null;
  socials: Record<string, string> | null;
};

function SocialLink({ href, label, children }: { href?: string; label: string; children: React.ReactNode }) {
  if (!href) return null;
  const safe = href.startsWith("http") ? href : `https://${href}`;
  return (
    <a
      href={safe}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-gray-700 hover:underline"
    >
      {children}
      <span className="sr-only">{label}</span>
    </a>
  );
}

export default function ProfileSummary() {
  const supabase = supabaseBrowser();
  const [p, setP] = useState<Profile | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, categories, preferred_shops, socials")
        .eq("id", user.id)
        .maybeSingle();
      setP(data as Profile | null);
    })();
  }, []);

  const cats = p?.categories || [];
  const shops = p?.preferred_shops || [];
  const soc = p?.socials || {};

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium text-gray-600 mb-2">Categories</div>
          {cats.length ? (
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <Badge key={c} className="bg-gray-100 text-gray-800">{c}</Badge>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No categories yet — add some above.</div>
          )}
        </div>

        <div>
          <div className="text-sm font-medium text-gray-600 mb-2">Preferred shops</div>
          {shops.length ? (
            <div className="flex flex-wrap gap-2">
              {shops.map((s) => (
                <Badge key={s} className="bg-gray-100 text-gray-800">{s}</Badge>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No shops yet — add some above.</div>
          )}
        </div>

        <div>
          <div className="text-sm font-medium text-gray-600 mb-2">Socials</div>
          <div className="flex items-center gap-4">
            <SocialLink href={soc.facebook} label="Facebook">
              <Facebook className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={soc.instagram} label="Instagram">
              <Instagram className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={soc.twitter} label="Twitter/X">
              <Twitter className="h-4 w-4" />
            </SocialLink>
            <SocialLink href={soc.website} label="Website">
              <Globe className="h-4 w-4" />
            </SocialLink>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
