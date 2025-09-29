"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Camera, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabaseBrowser } from "@/lib/supabase/client";

type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
};

function cn(...args: (string | false | undefined | null)[]) {
  return args.filter(Boolean).join(" ");
}

export default function ProfileBanner() {
  const supabase = supabaseBrowser();
  const [me, setMe] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, banner_url")
        .eq("id", user.id)
        .maybeSingle();
      if (!error) setMe(data as Profile);
      setLoading(false);
    })();
  }, []);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>, kind: "avatar"|"banner") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please sign in");

    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${user.id}/${kind}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("profile-assets")
      .upload(path, file, { upsert: true, cacheControl: "3600" });
    if (upErr) {
      alert(upErr.message || "Upload failed");
      return;
    }
    const { data: pub } = supabase.storage.from("profile-assets").getPublicUrl(path);
    const url = pub.publicUrl;

    setSaving(true);
    const update: any = {};
    if (kind === "avatar") update.avatar_url = url;
    else update.banner_url = url;

    const { error: updErr } = await supabase
      .from("profiles")
      .update(update)
      .eq("id", user.id);
    setSaving(false);
    if (updErr) {
      alert(updErr.message || "Could not save profile image");
      return;
    }

    setMe(prev => prev ? { ...prev, ...update } as Profile : prev);
  };

  const avatar = me?.avatar_url;
  const banner = me?.banner_url;
  const initials = useMemo(() => {
    const n = me?.display_name || "";
    const parts = n.split(" ").filter(Boolean);
    return (parts[0]?.[0] || "G") + (parts[1]?.[0] || "H");
  }, [me?.display_name]);

  return (
    <Card className="mb-8 overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: "3 / 1" }}>
        {/* background image or fallback gradient */}
        <div
          className={cn("absolute inset-0", banner ? "bg-cover bg-center" : "bg-gradient-to-r from-pink-100 via-white to-indigo-100")}
          style={banner ? { backgroundImage: `url(${banner})` } : {}}
        />
        {/* soft dark gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
        <label className="absolute right-3 bottom-3">
          <input type="file" accept="image/*" className="hidden" onChange={e => onFile(e, "banner")} />
          <Button size="sm" className="gap-2"><ImageIcon className="h-4 w-4" /> Change banner</Button>
        </label>
      </div>

      <div className="relative px-6 pb-6">
        <div className="relative -mt-12 h-24 w-24 rounded-full ring-4 ring-white bg-gray-200 overflow-hidden">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xl font-semibold text-gray-600 bg-white">
              {initials}
            </div>
          )}
          <label className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4">
            <input type="file" accept="image/*" className="hidden" onChange={e => onFile(e, "avatar")} />
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow ring-1 ring-gray-200 cursor-pointer">
              <Camera className="h-4 w-4" />
            </span>
          </label>
        </div>

        <div className="mt-3">
          <div className="text-lg font-semibold">{me?.display_name || "Your name"}</div>
          {saving && <div className="text-xs text-gray-500">Saving…</div>}
        </div>
      </div>
    </Card>
  );
}
