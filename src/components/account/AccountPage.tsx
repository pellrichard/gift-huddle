export default function AccountPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-12 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-gray-600">Manage your profile, notifications, and privacy.</p>
      </header>

      <div className="grid gap-6">
        <div className="rounded-xl border border-gray-200 p-6 bg-white">
          <h2 className="font-semibold mb-2">Profile</h2>
          <p className="text-sm text-gray-600">Coming soon: name, avatar, birthday preferences.</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-6 bg-white">
          <h2 className="font-semibold mb-2">Notifications</h2>
          <p className="text-sm text-gray-600">Coming soon: reminder frequency, email & push settings.</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-6 bg-white">
          <h2 className="font-semibold mb-2">Privacy</h2>
          <p className="text-sm text-gray-600">Coming soon: private vs public lists, visibility controls.</p>
        </div>
      </div>
    </section>
  );
}
