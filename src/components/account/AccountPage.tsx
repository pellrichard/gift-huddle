import React from "react";
import Image from "next/image";

type Profile = {
  display_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
};

export default function AccountPage({ profile }: { profile?: Profile }) {
  const p: Profile = profile ?? {
    display_name: null,
    avatar_url: null,
    banner_url: null,
  };

  return (
    <div className="p-4">
      <Image
        src={p.banner_url ?? "/banners/default.webp"}
        alt=""
        width={1600}
        height={320}
        className="h-40 w-full object-cover rounded-2xl"
      />
      <div className="mt-4 flex items-center gap-4">
        <Image
          src={p.avatar_url ?? "/avatars/default.webp"}
          alt={p.display_name ?? ""}
          width={96}
          height={96}
          className="h-24 w-24 rounded-full object-cover ring-4 ring-white"
        />
        <h1 className="text-xl font-semibold">{p.display_name ?? "Your Name"}</h1>
      </div>
    </div>
  );
}
