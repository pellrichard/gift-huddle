// pages/terms.tsx
import Head from "next/head";

export default function Terms() {
  return (
    <main className="p-8 max-w-3xl mx-auto prose">
      <Head>
        <title>Terms of Service | Gift Huddle</title>
        <meta name="robots" content="index,follow" />
      </Head>

      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString("en-GB")}</p>

      <h2>1. Agreement</h2>
      <p>
        These Terms govern your use of Gift Huddle. By accessing or using the service,
        you agree to them. If you do not agree, do not use the service.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>You must provide accurate information and keep your account secure.</li>
        <li>You are responsible for activity on your account.</li>
        <li>You must be at least 13 years old to use the service.</li>
      </ul>

      <h2>3. Acceptable use</h2>
      <ul>
        <li>No illegal, harmful, or abusive conduct.</li>
        <li>No infringement of others’ rights or privacy.</li>
        <li>No attempts to disrupt or reverse-engineer the service.</li>
      </ul>

      <h2>4. Content</h2>
      <p>
        You own your content. You grant us a limited license to host and display it
        to provide the service. You are responsible for the content you post.
      </p>

      <h2>5. Affiliates & external links</h2>
      <p>
        We may include affiliate links to retailers. We are not responsible for third-party
        sites, their products, or policies.
      </p>

      <h2>6. Service changes</h2>
      <p>
        We may change, suspend, or discontinue features at any time. We may also update these Terms.
      </p>

      <h2>7. Disclaimers</h2>
      <p>
        The service is provided “as is” without warranties. To the extent permitted by law,
        we disclaim implied warranties of merchantability, fitness for a particular purpose,
        and non-infringement.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the extent permitted by law, we are not liable for indirect, incidental, special,
        consequential, or punitive damages, or for any loss of profits or data.
      </p>

      <h2>9. Termination</h2>
      <p>
        We may suspend or terminate your access if you violate these Terms or for security reasons.
        You may stop using the service at any time.
      </p>

      <h2>10. Governing law</h2>
      <p>
        These Terms are governed by the laws of England and Wales, without regard to conflict of laws.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these Terms? Contact <a href="mailto:legal@gift-huddle.com">legal@gift-huddle.com</a>.
      </p>
    </main>
  );
}
