/* app/pages/privacy.tsx */
import Head from "next/head";

export default function Privacy() {
  return (
    <main className="p-8 max-w-3xl mx-auto prose">
      <Head>
        <title>Privacy Policy | Gift Huddle</title>
        <meta name="robots" content="index,follow" />
      </Head>

      <h1>Privacy Policy</h1>
      <p>Last updated: 26 September 2025</p>

      <p>
        This Privacy Policy explains how <strong>Gift Huddle</strong> (&quot;we&quot;, &quot;us&quot;) collects and
        uses your information when you use our gifting and wish-list service. We act as the
        data controller under UK GDPR. If you have questions, contact
        <a href="mailto:privacy@gift-huddle.com"> privacy@gift-huddle.com</a>.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Account data:</strong> name, email, password hash (never your raw password).</li>
        <li><strong>Social login data:</strong> if you sign in with Google, Apple, Facebook, or LinkedIn,
            we receive your provider ID and basic profile (name, email, avatar where available).</li>
        <li><strong>Profile data you add:</strong> date of birth (with optional year hiding), interests/categories,
            preferred shops, social profile links, friend connections.</li>
        <li><strong>Content:</strong> lists, items, comments, reactions, and &quot;mark as ordered&quot; actions.</li>
        <li><strong>Technical/usage data:</strong> IP address, device/browser info, pages/actions, referrers.</li>
        <li><strong>Affiliate click data:</strong> outbound retailer clicks and identifiers needed to attribute purchases.</li>
      </ul>

      <h2>How we use data</h2>
      <ul>
        <li>Authenticate you and keep your account secure (incl. social sign-in).</li>
        <li>Operate core features: create/share lists, suggestions, friend requests and approvals.</li>
        <li>Personalise recommendations based on your selected categories and preferred shops.</li>
        <li>Enable public list sharing via a link; anyone with the link can view (but not modify) unless you change settings.</li>
        <li>Track affiliate outbound clicks to help fund the service.</li>
        <li>Communicate service updates, security notices, and support.</li>
        <li>Prevent abuse, debug issues, and improve performance.</li>
      </ul>

      <h2>Legal bases (UK GDPR)</h2>
      <ul>
        <li><strong>Contract:</strong> providing and maintaining your account and lists.</li>
        <li><strong>Legitimate interests:</strong> service analytics, security, fraud prevention, and affiliate revenue.</li>
        <li><strong>Consent:</strong> optional marketing emails and cookie categories where required. You can withdraw any time.</li>
      </ul>

      <h2>Sharing &amp; processors</h2>
      <p>We share data with providers that help us run Gift Huddle:</p>
      <ul>
        <li><strong>Supabase</strong> (authentication, database, storage).</li>
        <li><strong>Vercel</strong> (application hosting and delivery).</li>
        <li>Retailers/affiliate networks receive click identifiers when you follow an outbound link.</li>
      </ul>
      <p>We may disclose information if required by law or to enforce our Terms.</p>

      <h2>Public lists &amp; visibility</h2>
      <ul>
        <li>Lists shared via a public link are viewable by anyone with the link.</li>
        <li>&quot;Mark as ordered&quot; requires sign-in; recipients cannot see who purchased unless you choose to tell them.</li>
        <li>You can keep your birth year hidden while still enabling birthday reminders.</li>
      </ul>

      <h2>Cookies &amp; analytics</h2>
      <p>
        We use necessary cookies for login/session. We may use optional analytics/affiliate cookies.
        Where required, we’ll display a consent banner letting you manage preferences.
      </p>

      <h2>International transfers</h2>
      <p>
        Our providers may process data outside the UK/EEA. We rely on appropriate safeguards such as
        Standard Contractual Clauses where applicable.
      </p>

      <h2>Security</h2>
      <p>
        We use industry-standard measures and rely on our processors’ protections. No method of
        transmission or storage is 100% secure.
      </p>

      <h2>Retention</h2>
      <p>
        We keep data only as long as needed for the purposes above. You can delete your account to
        remove most personal data sooner; we may retain minimal records for legal or security reasons.
      </p>

      <h2>Your rights</h2>
      <ul>
        <li>Access, correction, deletion, and portability.</li>
        <li>Object to or restrict processing where applicable.</li>
        <li>Withdraw consent where processing relies on consent.</li>
        <li>Complain to the ICO (UK) or your local authority.</li>
      </ul>

      <h2>Contact</h2>
      <p>
        Email <a href="mailto:privacy@gift-huddle.com">privacy@gift-huddle.com</a> for privacy requests.
        We may ask you to verify your identity before fulfilling a request.
      </p>

      <h2>Changes</h2>
      <p>
        We’ll update this policy as the service evolves. If changes are material, we’ll provide notice.
      </p>
    </main>
  );
}
