import CodeCleanup from "./components/CodeCleanup";
// app/layout.tsx
import type { Metadata } from "next";
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

// Import local components (relative paths to avoid alias issues)
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body\1>
      <CodeCleanup />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}