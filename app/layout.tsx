import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Plausible from "@/components/analytics/Plausible";

export const metadata: Metadata = {
  title: {
    default: "Gift Huddle",
    template: "%s · Gift Huddle",
  },
  description: "Build gift lists, invite friends, track prices, and never double-buy again.",
  openGraph: {
    title: "Gift Huddle",
    description: "Build gift lists, invite friends, track prices, and never double-buy again.",
    type: "website",
    url: "https://gift-huddle.com",
    images: ["/og/social-banner.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gift Huddle",
    description: "Build gift lists, invite friends, track prices, and never double-buy again.",
    images: ["/og/social-banner.webp"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? <Plausible /> : null}
        {children}
        <Footer />
      </body>
    </html>
  );
}
