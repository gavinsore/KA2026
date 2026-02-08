import { useState, useEffect } from 'react';

const Announcement = () => {
    const [announcement, setAnnouncement] = useState(null);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        fetch(`${import.meta.env.BASE_URL}data/announcement.json`)
            .then(res => res.json())
            .then(data => {
                if (data.active && data.message) {
                    setAnnouncement(data);
                }
            })
            .catch(() => {
                // Silently fail if no announcement file
            });
    }, []);

    if (!announcement || dismissed) return null;

    // Style based on type: info (blue), warning (amber), urgent (red)
    const styles = {
        info: {
            bg: 'bg-blue-50 border-blue-200',
            icon: 'text-blue-600',
            title: 'text-blue-900',
            text: 'text-blue-800',
            button: 'text-blue-600 hover:bg-blue-100'
        },
        warning: {
            bg: 'bg-amber-50 border-amber-200',
            icon: 'text-amber-600',
            title: 'text-amber-900',
            text: 'text-amber-800',
            button: 'text-amber-600 hover:bg-amber-100'
        },
        urgent: {
            bg: 'bg-red-50 border-red-200',
            icon: 'text-red-600',
            title: 'text-red-900',
            text: 'text-red-800',
            button: 'text-red-600 hover:bg-red-100'
        }
    };

    const style = styles[announcement.type] || styles.info;

    const icons = {
        info: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        urgent: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };

    return (
        <div className={`${style.bg} border-b-2 py-4 px-4`}>
            <div className="max-w-7xl mx-auto flex items-start gap-4">
                <div className={`${style.icon} shrink-0 mt-0.5`}>
                    {icons[announcement.type] || icons.info}
                </div>
                <div className="flex-1 min-w-0">
                    {announcement.title && (
                        <h3 className={`font-semibold ${style.title} mb-1`}>
                            {announcement.title}
                        </h3>
                    )}
                    <p className={`${style.text} text-sm leading-relaxed`}>
                        {announcement.message}
                    </p>
                    {announcement.lastUpdated && (
                        <p className={`${style.text} text-xs mt-2 opacity-70`}>
                            Last updated: {announcement.lastUpdated}
                        </p>
                    )}
                </div>
                <button
                    onClick={() => setDismissed(true)}
                    className={`${style.button} p-1.5 rounded-lg transition-colors shrink-0`}
                    aria-label="Dismiss announcement"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Announcement;
