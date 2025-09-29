// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import CodeCleanup from "./components/CodeCleanup";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Gift Huddle",
  description: "Gifting made social, fun and easy.",
  openGraph: {
    title: "Gift Huddle",
    description: "Gifting made social, fun and easy.",
    images: ["/social-share.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/social-share.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CodeCleanup />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
