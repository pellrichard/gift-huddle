'use client';
/* eslint-disable @next/next/no-img-element */

export default function Page() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 text-gray-900">
      {/* Nav */}
      <header className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Use your real logo */}
          <img src="/logo.svg" alt="Gift Huddle logo" className="h-9 w-9" />
          <span className="font-bold text-xl tracking-tight">Gift Huddle</span>
        </div>
        <span className="text-sm text-gray-500">Launching soon</span>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-8 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
            Plan giving together.
            <span className="block text-indigo-600">No more duplicate gifts.</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Gift Huddle lets friends &amp; family coordinate birthdays, weddings, Christmas and more—{" "}
            with budgets, shared wishlists, and reminders that actually help.
          </p>

          {/* Email capture mock (wire to Supabase later) */}
          <form className="mt-6 flex flex-col sm:flex-row gap-3" onSubmit={(e) => { e.preventDefault(); alert('Thanks! We&apos;ll be in touch.'); }}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-xl border border-gray-300 bg-white/90 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow hover:bg-indigo-700 transition"
            >
              Notify me
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
              {/* tiny avatars */}
              <img alt="avatar" className="h-8 w-8 rounded-full border border-white" src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=128&auto=format&fit=crop"/>
              <img alt="avatar" className="h-8 w-8 rounded-full border border-white" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=128&auto=format&fit=crop"/>
              <img alt="avatar" className="h-8 w-8 rounded-full border border-white" src="https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=128&auto=format&fit=crop"/>
            </div>
            <span>Join other early birds getting launch updates</span>
          </div>
        </div>

        {/* Mockup right side */}
        <div className="relative">
          <div className="absolute inset-0 -z-10 blur-3xl opacity-40 bg-gradient-to-tr from-indigo-200 via-pink-200 to-amber-200 rounded-3xl"/>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1400&auto=format&fit=crop"
              alt="App preview"
              className="w-full h-72 object-cover"
            />
            <div className="p-5 grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold">Shared wishlists</h3>
                <p className="text-sm text-gray-600 mt-1">Everyone adds ideas, you approve. One source of truth.</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold">Smart budgets</h3>
                <p className="text-sm text-gray-600 mt-1">Set per-person limits and stay on track automatically.</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold">Event reminders</h3>
                <p className="text-sm text-gray-600 mt-1">Never miss a birthday or anniversary again.</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4">
                <h3 className="font-semibold">Invite-only huddles</h3>
                <p className="text-sm text-gray-600 mt-1">Keep planning private for each family or friend group.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof / logos */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
          <p className="text-center text-sm uppercase tracking-wider text-gray-500">Designed for real life gifting</p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-6 opacity-80">
            <img alt="brand" className="h-10 object-contain mx-auto" src="https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=400&auto=format&fit=crop"/>
            <img alt="brand" className="h-10 object-contain mx-auto" src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=400&auto=format&fit=crop"/>
            <img alt="brand" className="h-10 object-contain mx-auto" src="https://images.unsplash.com/photo-1504805572947-34fad45aed93?q=80&w=400&auto=format&fit=crop"/>
            <img alt="brand" className="h-10 object-contain mx-auto" src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400&auto=format&fit=crop"/>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-2xl font-bold text-center">How Gift Huddle works</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          {[
            {step: '1', title: 'Create a huddle', desc: 'Start a private group for your family or friends.'},
            {step: '2', title: 'Add events & budgets', desc: 'Birthdays, Christmas, weddings—set per-person budgets.'},
            {step: '3', title: 'Build wishlists', desc: 'Collect links and ideas, then coordinate who buys what.'},
          ].map((s) => (
            <div key={s.step} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">{s.step}</div>
              <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
              <p className="mt-1 text-gray-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-3xl bg-indigo-600 text-white p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="text-2xl font-bold">Be first to try Gift Huddle</h3>
            <p className="text-indigo-100 mt-1">Enter your email and we&apos;ll invite you to the early beta.</p>
          </div>
          <form className="w-full md:w-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => { e.preventDefault(); alert('Thanks! We&apos;ll email you soon.'); }}>
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 rounded-xl border border-transparent bg-white/95 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="rounded-xl bg-black/90 px-6 py-3 font-semibold text-white hover:bg-black transition"
            >
              Join waitlist
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-6 pb-10 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="Gift Huddle icon" className="h-5 w-5" />
          <span>© {new Date().getFullYear()} Gift Huddle</span>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center gap-4">
          <a href="#" className="hover:text-gray-700">Privacy</a>
          <a href="#" className="hover:text-gray-700">Terms</a>
          <a href="mailto:hello@gift-huddle.com" className="hover:text-gray-700">Contact</a>
        </div>
      </footer>
    </main>
  );
}
