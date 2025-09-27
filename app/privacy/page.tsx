export const metadata = {
  title: 'Privacy | Gift Huddle',
  description: 'How we collect, use, and protect your data.',
};

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 prose">
      <h1>Privacy</h1>
      <p>We collect the minimum necessary data to provide Gift Huddle. We never sell your data.</p>
      <h2>Logins & permissions</h2>
      <p>Facebook Login requests only <strong>email</strong> and <strong>public profile</strong>. Google and Apple provide similar basic profile info.</p>
      <h2>Storage & security</h2>
      <ul>
        <li>Hosted on Supabase (Postgres) with encryption at rest.</li>
        <li>Field-level: <code>dob</code> stored as a date; <code>dob_hide_year</code> controls visibility.</li>
      </ul>
      <h2>Contact</h2>
      <p>Questions? Contact support@gift-huddle.com.</p>
    </main>
  );
}
