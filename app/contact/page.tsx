export const metadata = { title: "Contact | Gift Huddle" };

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 prose">
      <h1>Contact Us</h1>
      <p>
        For now, the fastest way to reach us is via our Facebook page. Tap the link below and
        send us a message on Messenger. We typically reply quickly.
      </p>
      <p>
        <a href="https://www.facebook.com/profile.php?id=61581098625976" target="_blank" rel="noopener noreferrer">
          Open our Facebook page in a new tab
        </a>
      </p>
      <hr />
      <h2>Coming soon</h2>
      <ul>
        <li>WhatsApp Business messaging</li>
        <li>Support email address</li>
        <li>In-app help & chat</li>
      </ul>
    </main>
  );
}
