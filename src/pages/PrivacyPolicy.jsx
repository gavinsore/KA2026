import SEO from '../components/SEO';

const Section = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-xl font-bold text-forest-900 mb-3 pb-2 border-b border-forest-200">{title}</h2>
        <div className="text-charcoal-600 space-y-3 text-sm leading-relaxed">
            {children}
        </div>
    </div>
);

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen py-12 md:py-20">
            <SEO
                title="Privacy Policy | Kettering Archers"
                description="Privacy policy for the Kettering Archers website. Learn how we use cookies and Google Analytics to improve your experience."
            />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold text-forest-900 mb-4">
                        Privacy <span className="gradient-text">Policy</span>
                    </h1>
                    <p className="text-charcoal-600 text-lg">
                        Last updated: May 2026
                    </p>
                </div>

                <div className="glass-card p-6 md:p-10">

                    <Section title="Who We Are">
                        <p>
                            This website is operated by <strong>Kettering Archers</strong>, a non-profit archery club
                            based in Kettering, Northamptonshire. We are affiliated to Archery GB, NCAS, and EMAS.
                        </p>
                        <p>
                            For any privacy-related queries, please contact us at{' '}
                            <a href="mailto:info@ketteringarchers.co.uk" className="text-forest-600 hover:text-gold-500 transition-colors font-medium">
                                info@ketteringarchers.co.uk
                            </a>.
                        </p>
                    </Section>

                    <Section title="What Data We Collect">
                        <p>
                            This website does not collect any personal information directly (such as names, addresses, or
                            payment details) unless you contact us via email.
                        </p>
                        <p>
                            We collect two categories of usage data:
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>
                                <strong>Server-side visit counts</strong> — recorded automatically for every page visit,
                                without any cookies or personal identifiers. See the section below for full details.
                            </li>
                            <li>
                                <strong>Google Analytics (GA4)</strong> — collected only <strong>if you consent</strong> via
                                the cookie banner. This may include pages visited, approximate location (country/region),
                                browser type, and how you arrived at the site.
                            </li>
                        </ul>
                    </Section>

                    <Section title="Cookies">
                        <p>
                            Google Analytics uses cookies — small text files stored on your device — to distinguish
                            visitors and track usage patterns. These cookies are set by Google and are governed by{' '}
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-forest-600 hover:text-gold-500 transition-colors font-medium"
                            >
                                Google's Privacy Policy
                            </a>.
                        </p>
                        <p>
                            We will only set analytics cookies <strong>after you have given your consent</strong> via
                            the cookie banner displayed when you first visit the site. You can change your preferences
                            at any time by clicking the cookie settings link in the footer.
                        </p>
                    </Section>

                    <Section title="Why We Collect This Data">
                        <p>
                            We use anonymised analytics to understand how our website is used so we can improve it
                            for our members and visitors. For example, we use it to:
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>See which pages are most popular</li>
                            <li>Understand how visitors find our site</li>
                            <li>Identify and fix technical issues</li>
                        </ul>
                        <p>
                            The legal basis for this processing is <strong>your consent</strong> (UK GDPR Article 6(1)(a)).
                        </p>
                    </Section>

                    <Section title="Server-Side Analytics (No Consent Required)">
                        <p>
                            In addition to Google Analytics, we operate our own <strong>privacy-first visit counter</strong>.
                            When you visit any page on this website, our server records:
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>The page URL path visited (e.g. <code className="font-mono text-forest-700">/events</code>)</li>
                            <li>The referring website (e.g. a search engine), if any</li>
                            <li>Your browser type (user-agent string)</li>
                        </ul>
                        <p>
                            <strong>Your IP address is never stored.</strong> It is used solely for automatic bot
                            filtering (to exclude web crawlers from the count) and is immediately discarded.
                            No cookies are set by this system and no persistent identifier of any kind is stored
                            on your device.
                        </p>
                        <p>
                            The lawful basis for this processing is <strong>Legitimate Interest</strong> (UK GDPR
                            Article 6(1)(f)). We have a legitimate interest in understanding how our website is used
                            so that we can improve it for members and visitors. As no personal data is retained and
                            no individual profiling takes place, this processing does not override your privacy rights.
                        </p>
                        <p>
                            This processing does <strong>not</strong> require your consent under UK PECR because
                            nothing is stored on your device.
                        </p>
                    </Section>

                    <Section title="How Long Data Is Retained">
                        <p>We apply a two-tier retention policy to our server-side visit data:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>
                                <strong>Daily visit records</strong> — kept for <strong>12 months</strong>, then
                                automatically deleted.
                            </li>
                            <li>
                                <strong>Monthly summary totals</strong> — aggregated counts (page name + visit count
                                per month, no individual records) are retained for <strong>5 years</strong> to allow
                                long-term trend analysis.
                            </li>
                        </ul>
                        <p>
                            Google Analytics data is retained for <strong>14 months</strong> by default within
                            Google's systems. We do not store Google Analytics data on our own servers.
                        </p>
                    </Section>

                    <Section title="Third Parties">
                        <p>
                            We share anonymised usage data with <strong>Google LLC</strong> for analytics purposes only.
                            Google may transfer this data internationally. For full details, see{' '}
                            <a
                                href="https://policies.google.com/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-forest-600 hover:text-gold-500 transition-colors font-medium"
                            >
                                Google's Privacy Policy
                            </a>.
                        </p>
                        <p>
                            We do not sell, rent, or share your data with any other third parties.
                        </p>
                    </Section>

                    <Section title="Your Rights">
                        <p>Under UK GDPR, you have the right to:</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><strong>Withdraw consent</strong> at any time via the cookie settings link in the footer</li>
                            <li><strong>Opt out of Google Analytics</strong> across all websites using Google's{' '}
                                <a
                                    href="https://tools.google.com/dlpage/gaoptout"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-forest-600 hover:text-gold-500 transition-colors font-medium"
                                >
                                    opt-out browser add-on
                                </a>
                            </li>
                            <li><strong>Request access</strong> to any personal data we hold about you</li>
                            <li><strong>Request deletion</strong> of any personal data we hold about you</li>
                        </ul>
                        <p>
                            To exercise any of these rights, please contact us at{' '}
                            <a href="mailto:info@ketteringarchers.co.uk" className="text-forest-600 hover:text-gold-500 transition-colors font-medium">
                                info@ketteringarchers.co.uk
                            </a>.
                        </p>
                        <p>
                            You also have the right to lodge a complaint with the{' '}
                            <a
                                href="https://ico.org.uk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-forest-600 hover:text-gold-500 transition-colors font-medium"
                            >
                                Information Commissioner's Office (ICO)
                            </a>.
                        </p>
                    </Section>

                    <Section title="Changes to This Policy">
                        <p>
                            We may update this policy from time to time. Any significant changes will be noted at the
                            top of this page with a revised date.
                        </p>
                    </Section>

                    <Section title="Cookie Declaration">
                        <p>The following cookies may be set on your device when you visit this website:</p>
                        <div className="mt-4 overflow-x-auto">
                            <table className="w-full text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-forest-200">
                                        <th className="text-left py-2 pr-4 text-forest-800 font-semibold">Name</th>
                                        <th className="text-left py-2 pr-4 text-forest-800 font-semibold">Category</th>
                                        <th className="text-left py-2 pr-4 text-forest-800 font-semibold">Purpose</th>
                                        <th className="text-left py-2 text-forest-800 font-semibold">Expires</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-forest-100">
                                    <tr>
                                        <td className="py-2 pr-4 font-mono text-forest-700">ka_cookie_consent</td>
                                        <td className="py-2 pr-4"><span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 font-medium">Necessary</span></td>
                                        <td className="py-2 pr-4 text-charcoal-600">Stores your cookie consent preference (localStorage, not a cookie)</td>
                                        <td className="py-2 text-charcoal-600">Until cleared</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 font-mono text-forest-700">sb-*</td>
                                        <td className="py-2 pr-4"><span className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 font-medium">Necessary</span></td>
                                        <td className="py-2 pr-4 text-charcoal-600">Supabase authentication — keeps admin users logged in. Only set if you log in.</td>
                                        <td className="py-2 text-charcoal-600">Session</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 font-mono text-forest-700">_ga</td>
                                        <td className="py-2 pr-4"><span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 font-medium">Statistics</span></td>
                                        <td className="py-2 pr-4 text-charcoal-600">Google Analytics — distinguishes unique visitors</td>
                                        <td className="py-2 text-charcoal-600">2 years</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 font-mono text-forest-700">_ga_QJQ78M8P1P</td>
                                        <td className="py-2 pr-4"><span className="px-2 py-0.5 rounded-full bg-gold-100 text-gold-700 font-medium">Statistics</span></td>
                                        <td className="py-2 pr-4 text-charcoal-600">Google Analytics — maintains session state</td>
                                        <td className="py-2 text-charcoal-600">2 years</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-3">
                            Statistics cookies are only set <strong>after you accept</strong> via the cookie banner.
                            You can change your preference at any time using the{' '}
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('ka-show-cookie-preferences'))}
                                className="text-forest-600 hover:text-gold-500 transition-colors font-medium underline underline-offset-2 cursor-pointer"
                            >
                                Cookie Preferences
                            </button>{' '}link in the footer.
                        </p>
                    </Section>

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
