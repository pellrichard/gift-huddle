import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Gift Huddle</h1>
      <p className="mt-2">Welcome.</p>
      <Link href="/account" className="underline">Go to Account</Link>
    </main>
  );
}