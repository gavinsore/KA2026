import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'ka_cookie_consent';
const CONSENT_VERSION = 1;

const updateGoogleConsent = (statistics) => {
    if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
            analytics_storage: statistics ? 'granted' : 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
        });
    }
};

const CookieBanner = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Apply any previously stored consent immediately on load
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const { statistics } = JSON.parse(stored);
                updateGoogleConsent(statistics);
            } catch {
                localStorage.removeItem(STORAGE_KEY);
                setVisible(true);
            }
        } else {
            setVisible(true);
        }

        // Allow the footer link to re-open the banner
        const handler = () => setVisible(true);
        window.addEventListener('ka-show-cookie-preferences', handler);
        return () => window.removeEventListener('ka-show-cookie-preferences', handler);
    }, []);

    const handleAccept = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: CONSENT_VERSION,
            statistics: true,
            timestamp: Date.now(),
        }));
        updateGoogleConsent(true);
        setVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: CONSENT_VERSION,
            statistics: false,
            timestamp: Date.now(),
        }));
        updateGoogleConsent(false);
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            role="dialog"
            aria-label="Cookie preferences"
            aria-live="polite"
            style={{ zIndex: 9999 }}
            className="fixed bottom-0 left-0 right-0 p-4 md:p-6"
        >
            <div className="max-w-4xl mx-auto">
                <div className="bg-forest-900 border border-forest-700 rounded-2xl shadow-2xl p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">

                        {/* Icon + Text */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm mb-1">Cookie Preferences</p>
                                <p className="text-forest-300 text-sm leading-relaxed">
                                    We use <strong className="text-forest-200">Google Analytics</strong> to understand how visitors use this site — no advertising or social media tracking.
                                    Essential cookies (Supabase session) are always active.{' '}
                                    <Link to="/privacy" className="text-gold-400 hover:text-gold-300 underline underline-offset-2 transition-colors">
                                        Privacy Policy
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex items-center gap-3 shrink-0 ml-14 md:ml-0">
                            <button
                                id="cookie-decline-btn"
                                onClick={handleDecline}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-forest-300 border border-forest-600 hover:border-forest-400 hover:text-white transition-all duration-200"
                            >
                                Decline
                            </button>
                            <button
                                id="cookie-accept-btn"
                                onClick={handleAccept}
                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gold-500 text-forest-900 hover:bg-gold-400 transition-all duration-200"
                            >
                                Accept Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
