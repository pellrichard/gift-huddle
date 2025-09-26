// app/features/page.tsx
import Image from "next/image";

const features = [
  { title: "Build Wish Lists", description: "Create and share lists of gifts for any occasion.", icon: "/icons/features/wishlist.svg" },
  { title: "Connect with Friends", description: "Invite friends and family to view and contribute.", icon: "/icons/features/friends.svg" },
  { title: "Birthday Reminders", description: "Never miss a special day with smart reminders.", icon: "/icons/features/birthday.svg" },
  { title: "Shop Your Favorites", description: "Discover gifts from top stores with affiliate deals.", icon: "/icons/features/affiliate.svg" },
];

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold text-center mb-10">Features</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="flex flex-col items-center text-center p-6 border rounded-2xl shadow-sm">
            <img src={f.icon} alt={f.title} width={48} height={48} className="opacity-90" />
            <h2 className="mt-4 text-xl font-semibold">{f.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
