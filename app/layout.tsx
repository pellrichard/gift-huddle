import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import HeaderBar from "@/components/chrome/HeaderBar";
import FooterBar from "@/components/chrome/FooterBar";

export const metadata: Metadata = {
  title: "Gift Huddle",
  description: "Collect gift ideas with friends and family. Save links, plan budgets, and avoid duplicates.",
  metadataBase: new URL("https://www.gift-huddle.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <HeaderBar />
        <main className="flex-1">{children}</main>
        <FooterBar />
      </body>
    </html>
  );
}
