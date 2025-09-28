import type { Metadata } from "next";
import { baloo2 } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gift Huddle",
  description: "Gifting made social, fun and easy.",
  openGraph: {
    title: "Gift Huddle",
    description: "Gifting made social, fun and easy.",
    images: ["/gift-huddle-logo.svg"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/gift-huddle-logo.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={baloo2.variable}>
      <body>{children}</body>
    </html>
  );
}
