// pages/privacy.tsx
import Head from "next/head";

export default function Privacy() {
  return (
    <main className="p-8 max-w-3xl mx-auto prose">
      <Head>
        <title>Privacy Policy | Gift Huddle</title>
        <meta name="robots" content="index,follow" />
      </Head>

      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString("en-GB")}</p>

      <p>
        Gift Huddle ("we", "us") respects your privacy. This Privacy Policy explains
        what personal data we collect, how we use it, and your rights. We are the
        controller for the purposes of UK GDPR and EU GDPR.
      </p>

      <h2>Data we collect</h2>
      <ul>
        <li><strong>Account data:</strong> name, email address, password hash.</li>
        <li><strong>Social login data:</strong> provider ID and basic profile info when you choose to sign in via Google, Apple, Facebook, or LinkedIn.</li>
        <li><strong>Profile data:</strong> date of birth (year optional), interests/categories, preferred shops, social profile links.</li>
        <li><strong>Content:</strong> wish lists, items, comments, “marked as ordered” activity.</li>
        <li><strong>Usage data:</strong> device/browser info, IP address, pages viewed, and actions on the site.</li>
      </ul>

      <h2>How we use your data</h2>
      <ul>
        <li>To create and manage your account and sign-in (including via social providers).</li>
        <li>To provide the gifting features: lists, suggestions, sharing, friend connections.</li>
        <li>To personalise recommendations based on your selected categories and shops.</li>
        <li>To process affiliate outbound clicks and track conversions with retailers.</li>
        <li>To maintain security, prevent abuse, and debug the service.</li>
        <li>To communicate with you about updates, security alerts, and support.</li>
      </ul>

      <h2>Legal bases</h2>
      <ul>
        <li><strong>Contract:</strong> to provide the service you requested.</li>
        <li><strong>Legitimate interests:</strong> service improvement, security, and fraud prevention.</li>
        <li><strong>Consent:</strong> optional features like marketing emails; you can withdraw at any time.</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We share data with service providers that help us operate the app (e.g., hosting,
        authentication, analytics). We may share aggregated or de-identified information.
        If required by law, we may disclose information to authorities.
      </p>

      <h2>International transfers</h2>
      <p>
        We may transfer data outside the UK/EEA. Where we do, we use appropriate safeguards such as
        Standard Contractual Clauses or other lawful transfer mechanisms.
      </p>

      <h2>Retention</h2>
      <p>
        We keep personal data only as long as necessary for the purposes above, then delete or
        anonymise it. You can delete your account to remove most data earlier.
      </p>

      <h2>Your rights</h2>
      <ul>
        <li>Access, correction, deletion</li>
        <li>Portability (in certain cases)</li>
        <li>Restriction or objection to processing</li>
        <li>Withdraw consent (where processing is based on consent)</li>
        <li>Complain to a supervisory authority</li>
      </ul>

      <h2>Children</h2>
      <p>
        Gift Huddle is not intended for children under 13. If you believe a child has provided
        personal data, contact us to delete it.
      </p>

      <h2>Contact</h2>
      <p>
        For privacy requests, contact: <a href="mailto:privacy@gift-huddle.com">privacy@gift-huddle.com</a>.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy from time to time. If we make material changes, we will notify you.
      </p>
    </main>
  );
}
