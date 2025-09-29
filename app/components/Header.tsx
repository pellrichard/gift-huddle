import React from "react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex items-center p-4">
      <Image
        src="/logo.webp"
        alt="Gift Huddle"
        width={128}
        height={32}
        className="h-8 w-auto"
        priority
      />
    </header>
  );
}
