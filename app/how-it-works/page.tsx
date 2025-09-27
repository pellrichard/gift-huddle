export const metadata = {
  title: 'How it works | Gift Huddle',
  description: 'We use affiliate links, price monitoring, and your preferences to recommend great gifts — at no cost to you.',
};

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12 prose">
      <h1>How it works</h1>
      <p><strong>No cost to you.</strong> Gift Huddle earns a small commission from retailers via affiliate programs when you click through and buy. Your price stays the same.</p>
      <h2>Smart suggestions</h2>
      <ul>
        <li><strong>Your preferences:</strong> choose categories and favourite shops.</li>
        <li><strong>Affiliate catalogs:</strong> we prioritise retailers we partner with.</li>
        <li><strong>Price awareness:</strong> we track price history and highlight drops.</li>
      </ul>
      <h2>Privacy-first</h2>
      <ul>
        <li>We request minimal permissions for social login (Facebook: email + public profile).</li>
        <li>Your data is stored securely and <em>never sold or shared</em>.</li>
      </ul>
      <h2>What you can do</h2>
      <ol>
        <li>Create wishlists and share a link with friends & family.</li>
        <li>Friends can mark items as ordered (requires sign in) to avoid duplicates.</li>
        <li>Get reminders when your list is running low.</li>
      </ol>
    </main>
  );
}
