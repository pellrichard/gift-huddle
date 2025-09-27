// app/(public)/how-it-works/page.tsx
import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    title: "We use affiliate links (no cost to you)",
    description:
      "When you click a gift suggestion and buy from the retailer, they pay us a small commission. You never pay extra—prices are exactly the same as going direct.",
    icon: "/icons/howitworks/affiliate-link.svg",
  },
  {
    title: "Smart price monitoring",
    description:
      "We keep an eye on price changes and availability, surfacing better-value alternatives when something drops in price or goes out of stock.",
    icon: "/icons/howitworks/price-tag.svg",
  },
  {
    title: "Personalised suggestions",
    description:
      "Pick your interests and preferred shops. We combine those with trending products and friend hints to recommend gifts that feel spot on.",
    icon: "/icons/howitworks/preferences.svg",
  },
  {
    title: "Your data stays private",
    description:
      "We never sell or share your data. Everything is stored securely with modern encryption and strict access controls.",
    icon: "/icons/howitworks/shield.svg",
  },
];

const steps = [
  {
    step: "1",
    title: "Create your account",
    text:
      "Sign in with your email or social login. Add your birthday (optional) and choose whether to hide your birth year.",
    icon: "/icons/howitworks/account.svg",
  },
  {
    step: "2",
    title: "Set preferences",
    text:
      "Select interests and favourite shops so we can personalise your suggestions.",
    icon: "/icons/howitworks/preferences.svg",
  },
  {
    step: "3",
    title: "Invite friends & family",
    text:
      "Connect with people you care about, view their wish lists, and collaborate on gifts.",
    icon: "/icons/howitworks/friends.svg",
  },
  {
    step: "4",
    title: "Shop the best picks",
    text:
      "Explore suggestions with affiliate links—same price, but retailers share a commission with us, which keeps Gift Huddle free.",
    icon: "/icons/howitworks/affiliate-link.svg",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold">How Gift Huddle Works</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
          A free gifting companion powered by affiliate partnerships, smart price monitoring,
          and your preferences—so the right gift finds you faster.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-14">
        {highlights.map((h) => (
          <div key={h.title} className="p-6 border rounded-2xl shadow-sm text-center">
            <Image src={h.icon} alt="" width={56} height={56} />
            <h3 className="mt-4 text-lg font-semibold">{h.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{h.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">From signup to gift in four steps</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.title} className="p-6 border rounded-2xl shadow-sm">
              <div className="flex items-center gap-3">
                <Image src={s.icon} alt="" width={40} height={40} />
                <div className="text-2xl font-bold">{s.step}</div>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2 items-start mb-16">
        <div className="p-6 border rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <Image src="/icons/howitworks/affiliate-link.svg" alt="" width={32} height={32} />
            <h3 className="text-lg font-semibold">Affiliate disclosure</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Gift Huddle is free for you to use. When you purchase through a retailer link on our site,
            the retailer may pay us a small commission. You pay the same price you would pay directly
            on the retailer’s website.
          </p>
        </div>

        <div className="p-6 border rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <Image src="/icons/howitworks/shield.svg" alt="" width={32} height={32} />
            <h3 className="text-lg font-semibold">Your privacy</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            We never sell or share your data. Information is stored securely and encrypted, with strict
            access controls. You control what you share with friends, and you can delete your account
            at any time.
          </p>
        </div>
      </section>

      <section className="text-center">
        <Link
          href="/login"
          className="rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-primary/90"
        >
          Get Started
        </Link>
      </section>
    </div>
  );
}
