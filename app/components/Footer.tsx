import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="p-4 text-center text-gray-500">
      <Image
        src="/logo.webp"
        alt="Gift Huddle"
        width={128}
        height={32}
        className="h-8 w-auto"
        priority
      />
    </footer>
  );
}
