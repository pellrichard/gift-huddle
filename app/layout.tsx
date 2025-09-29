// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gift Huddle",
  description: "Gifting made social, fun and easy.",
  openGraph: {
    title: "Gift Huddle",
    description: "Gifting made social, fun and easy.",
    images: [
      { url: "/social-share.png", width: 1200, height: 630, alt: "Gift Huddle OG" },
      { url: "/social-share-linkedin.png", width: 1200, height: 1200, alt: "Gift Huddle LinkedIn" }
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/social-share.png"],
  },
};

// Import local components (relative paths to avoid alias issues)
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
