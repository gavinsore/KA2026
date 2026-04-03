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
                        Last updated: April 2025
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
                            With your consent, we use <strong>Google Analytics (GA4)</strong> to collect anonymised
                            usage data about how visitors interact with our website. This may include:
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Pages visited and time spent on each page</li>
                            <li>Approximate geographic location (country / region level only)</li>
                            <li>Browser type and device type</li>
                            <li>How you arrived at the site (e.g. search engine, direct link)</li>
                        </ul>
                        <p>
                            This data is <strong>anonymised</strong> — we cannot identify you personally from it.
                        </p>
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

                    <Section title="How Long Data Is Retained">
                        <p>
                            Google Analytics data is retained for <strong>14 months</strong> by default, after which
                            it is automatically deleted. We do not store any analytics data on our own servers.
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

                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
