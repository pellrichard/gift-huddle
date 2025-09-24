export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 text-center px-6">
      <div className="max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          Gift Huddle
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          A smarter way to plan birthdays, weddings, and special occasions.
          <br />
          Launching soon — join the huddle!
        </p>
        <form className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full sm:w-auto flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white shadow hover:bg-indigo-700 transition"
          >
            Notify Me
          </button>
        </form>
      </div>
      <footer className="mt-16 text-sm text-gray-400">
        © {new Date().getFullYear()} Gift Huddle. All rights reserved.
      </footer>
    </main>
  );
}
