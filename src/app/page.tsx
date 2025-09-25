'use client';
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';

export default function Page() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle'|'ok'|'err'|'loading'>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, company: '' }) // honeypot = ''
      });
      const json = await res.json();
      setStatus(json.ok ? 'ok' : 'err');
      if (json.ok) { setEmail(''); setName(''); }
    } catch {
      setStatus('err');
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Top nav */}
      <header className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        <a className="flex items-center gap-3" href="#">
          <img src="/logo.svg" alt="Gift Huddle logo" className="h-8 w-8" />
          <span className="font-extrabold text-xl">Gift Huddle</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#features" className="hover:text-gray-900">Features</a>
          <a href="#how" className="hover:text-gray-900">How it Works</a>
          <a href="#pricing" className="hover:text-gray-900">Pricing</a>
        </nav>
        <a
          href="#notify"
          className="rounded-xl bg-rose-500 text-white px-4 py-2 font-semibold shadow hover:bg-rose-600 transition"
        >
          Get Started
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-10 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            Plan, share, and
            <br className="hidden sm:block" />
            <span className="block mt-2">celebrate together.</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Create gift lists for birthdays, weddings, holidays, and more. Set budgets, get
            reminders, and avoid duplicate gifts.
          </p>

          <div id="notify" className="mt-6">
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full sm:w-48 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="rounded-xl bg-rose-500 px-6 py-3 font-semibold text-white shadow hover:bg-rose-600 transition disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending…' : 'Get Started'}
              </button>
            </form>
            {status === 'ok' && (
              <p className="mt-3 text-sm text-green-600">Thanks! You’re on the list.</p>
            )}
            {status === 'err' && (
              <p className="mt-3 text-sm text-rose-600">Something went wrong. Please try again.</p>
            )}
          </div>
        </div>

        {/* Illustration placeholder (swap when ready) */}
        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-tr from-rose-100 via-indigo-100 to-emerald-100 blur-2xl opacity-70" />
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
            <img
              src="https://images.unsplash.com/illustrations/0001.png?auto=format&fit=crop&w=1200&q=80"
              alt="Illustration"
              className="w-full h-72 object-cover rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Feature row */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid sm:grid-cols-2 gap-8">
          <Feature icon="🎁" title="Build Gift Lists" text="Invite your family and friends to join and create personalized gift lists." />
          <Feature icon="💸" title="Set Budgets" text="Stay on budget by setting spending limits for each person and occasion." />
          <Feature icon="🔔" title="Get Reminders" text="Receive timely reminders so you’re never caught off guard." />
          <Feature icon="📋" title="Track Gifts" text="See which gifts have been purchased and what’s still available." />
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="Gift Huddle icon" className="h-5 w-5" />
          <span>© {new Date().getFullYear()} Gift Huddle</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-700">Privacy</a>
          <a href="#" className="hover:text-gray-700">Terms</a>
          <a href="mailto:hello@gift-huddle.com" className="hover:text-gray-700">Contact</a>
        </div>
      </footer>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-2xl">{icon}</div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{text}</p>
      </div>
    </div>
  );
}
