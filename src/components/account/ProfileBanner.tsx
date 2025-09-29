import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
};

const supabase = createClient("", ""); // placeholder

export default function ProfileBanner({ profile }: { profile: Profile }) {
  const [bannerUploading, setBannerUploading] = useState<boolean>(false);
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false);

  const onBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerUploading(true);
    try {
      // upload logic ...
    } finally {
      setBannerUploading(false);
    }
  };

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      // upload logic ...
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <label>
        Banner:
        <input type="file" onChange={onBannerChange} />
      </label>
      <label>
        Avatar:
        <input type="file" onChange={onAvatarChange} />
      </label>
    </div>
  );
}
