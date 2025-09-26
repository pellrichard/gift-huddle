import Image from "next/image";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="max-w-6xl mx-auto px-6 py-12">
    <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
    <div className="prose prose-slate max-w-none">{children}</div>
  </section>
);

const FeatureCard = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-gray-200 p-6 shadow-sm bg-white">
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 text-xl">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

export default function FeaturesPage() {
  return (
    <main className="pb-20">
      {/* Intro / Concept */}
      <div className="bg-gradient-to-b from-white to-gray-50 border-b">
        <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              All your gifting—organized.
            </h1>
            <p className="text-lg text-gray-700">
              Gift Huddle helps families and friends plan gifting together. Create events, build wish
              lists, invite your crew, set budgets, and get reminders—so nobody buys the same thing twice.
            </p>
          </div>
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border bg-white">
            <Image
              src="/img/hero-wishlist.png"
              alt="Gift Huddle illustration"
              fill
              className="object-contain p-6"
              priority
            />
          </div>
        </section>
      </div>

      {/* Events you can create */}
      <Section title="Create events that fit your life">
        <p>
          Spin up events in seconds and attach wish lists your friends and family can see.
          Perfect for the moments that matter most:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 !mt-6 list-none p-0">
          {[
            "Birthdays",
            "Weddings & Engagements",
            "Anniversaries",
            "Baby Showers & New Baby",
            "Christmas",
            "Eid",
            "Hanukkah",
            "Diwali",
            "Lunar New Year",
            "Graduations",
            "Housewarming",
            "Retirements",
          ].map((evt) => (
            <li key={evt} className="rounded-xl border border-gray-200 px-4 py-3 bg-white text-gray-800">
              {evt}
            </li>
          ))}
        </ul>
      </Section>

      {/* Core features */}
      <Section title="Features that keep everyone in sync">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Build Gift Lists"
            description="Create and share lists for each event. Add links, notes, and priorities so people know exactly what to buy."
            icon={<span>🎁</span>}
          />
          <FeatureCard
            title="Friends & Family"
            description="Invite people with a link, approve requests, and control who sees which lists."
            icon={<span>👪</span>}
          />
          <FeatureCard
            title="Birthday Reminders"
            description="Flag contacts' birthdays and we’ll remind you in advance—never miss a special day."
            icon={<span>🎂</span>}
          />
          <FeatureCard
            title="Smart Reminders"
            description="Choose reminder frequency and channel—push notifications or email—so you’re nudged at the right time."
            icon={<span>🔔</span>}
          />
          <FeatureCard
            title="Kids' Lists with Safeguards"
            description="Maintain age-appropriate lists with optional parental controls and visibility settings."
            icon={<span>🧒</span>}
          />
          <FeatureCard
            title="Private or Public"
            description="Keep lists private for your circle or make them public with a shareable link. Mark items as ordered to avoid duplicates."
            icon={<span>🔒</span>}
          />
          <FeatureCard
            title="Budgets & Tracking"
            description="Set budgets per event and track what’s been purchased and what’s still available."
            icon={<span>💰</span>}
          />
          <FeatureCard
            title="iPhone & Android Apps"
            description="Use Gift Huddle on the go with our iOS and Android apps (coming soon)."
            icon={<span>📱</span>}
          />
          <FeatureCard
            title="Shop Preferences"
            description="Pick your favorite stores for tailored suggestions and simple shopping."
            icon={<span>🛍️</span>}
          />
        </div>
      </Section>
    </main>
  );
}
