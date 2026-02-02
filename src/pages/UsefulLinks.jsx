const UsefulLinks = () => {
    const linkCategories = [
        {
            title: "Governing Bodies",
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            color: "forest",
            links: [
                {
                    name: "Archery GB",
                    url: "https://archerygb.org",
                    description: "The national governing body for archery in Great Britain"
                },
                {
                    name: "World Archery",
                    url: "https://worldarchery.sport",
                    description: "International Federation for the sport of archery"
                },
                {
                    name: "NCAS (Northamptonshire CAS)",
                    url: "https://ncas-archery.org.uk",
                    description: "Northamptonshire County Archery Society"
                }
            ]
        },
        {
            title: "Equipment Suppliers",
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            color: "gold",
            links: [
                {
                    name: "Merlin Archery",
                    url: "https://www.merlinarchery.co.uk",
                    description: "One of the UK's largest archery retailers"
                },
                {
                    name: "The Archery Shop",
                    url: "https://www.thearcheryshop.co.uk",
                    description: "Wide range of archery equipment and accessories"
                },
                {
                    name: "Aim4Sport",
                    url: "https://www.aim4sport.com",
                    description: "Archery specialists with expert advice"
                },
                {
                    name: "Wales Archery",
                    url: "https://www.walesarchery.com",
                    description: "Quality equipment and fast delivery"
                },
                {
                    name: "Bowsports",
                    url: "https://www.bowsports.com",
                    description: "Archery equipment and target sports"
                }
            ]
        },
        {
            title: "Training & Coaching",
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
            ),
            color: "purple",
            links: [
                {
                    name: "Archery GB Coaching",
                    url: "https://archerygb.org/coaches",
                    description: "Coaching qualifications and resources"
                },
                {
                    name: "Online Archery Academy",
                    url: "https://www.onlinearcheryacademy.com",
                    description: "Video lessons from top coaches"
                },
                {
                    name: "NuSensei (YouTube)",
                    url: "https://www.youtube.com/@NUSensei",
                    description: "Popular archery education channel"
                }
            ]
        },
        {
            title: "Neighbouring Clubs",
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            color: "blue",
            links: [
                {
                    name: "Wellingborough Archery Club",
                    url: "https://www.wellingborough-archery.org.uk",
                    description: "Friendly club in neighbouring Wellingborough"
                },
                {
                    name: "Corby Bowmen",
                    url: "https://www.corbybowmen.co.uk",
                    description: "Active club in Corby"
                },
                {
                    name: "Northampton Archery Club",
                    url: "https://www.northamptonarcheryclub.co.uk",
                    description: "One of the largest clubs in the county"
                }
            ]
        },
        {
            title: "Rules & Resources",
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            color: "charcoal",
            links: [
                {
                    name: "Rules of Shooting",
                    url: "https://archerygb.org/rules",
                    description: "Official Archery GB rules and procedures"
                },
                {
                    name: "Handicap Tables",
                    url: "https://archerygb.org/handicap",
                    description: "Official handicap and classification tables"
                },
                {
                    name: "Field Captain's Guide",
                    url: "https://archerygb.org/field-captains",
                    description: "Guide for running archery events"
                }
            ]
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            forest: 'bg-forest-600/20 text-forest-400 group-hover:bg-forest-600',
            gold: 'bg-gold-600/20 text-gold-400 group-hover:bg-gold-600',
            purple: 'bg-purple-600/20 text-purple-400 group-hover:bg-purple-600',
            blue: 'bg-blue-600/20 text-blue-400 group-hover:bg-blue-600',
            charcoal: 'bg-charcoal-600/20 text-charcoal-300 group-hover:bg-charcoal-600'
        };
        return colors[color] || colors.forest;
    };

    return (
        <div className="min-h-screen py-12 md:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Useful <span className="gradient-text">Links</span>
                    </h1>
                    <p className="text-charcoal-400 text-lg max-w-2xl mx-auto">
                        A curated collection of archery resources, from governing bodies to equipment suppliers.
                    </p>
                </div>

                {/* Link Categories */}
                <div className="space-y-10">
                    {linkCategories.map((category, categoryIndex) => (
                        <section key={category.title} className="animate-fade-in-up" style={{ animationDelay: `${categoryIndex * 0.1}s`, opacity: 0 }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getColorClasses(category.color).split(' ').slice(0, 2).join(' ')}`}>
                                    {category.icon}
                                </div>
                                <h2 className="text-xl font-bold text-white">{category.title}</h2>
                            </div>

                            <div className="grid gap-4">
                                {category.links.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="glass-card p-5 group hover:border-opacity-50 transition-all duration-300"
                                        style={{ borderColor: `var(--color-${category.color}-500)`, borderOpacity: 0.1 }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-medium text-white group-hover:text-forest-400 transition-colors mb-1">
                                                    {link.name}
                                                </h3>
                                                <p className="text-charcoal-400 text-sm">{link.description}</p>
                                                <p className="text-charcoal-500 text-xs mt-2 truncate">{link.url}</p>
                                            </div>
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ml-4 shrink-0 transition-all duration-300 ${getColorClasses(category.color)} group-hover:text-white`}>
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Suggestion Box */}
                <div className="mt-16 glass-card p-6 md:p-8 border-gold-500/30 text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">Know a useful link?</h3>
                    <p className="text-charcoal-400 mb-4">
                        If you know of a useful archery resource that should be included here, let us know!
                    </p>
                    <a href="mailto:info@ketteringarchers.co.uk?subject=Link%20Suggestion" className="btn-secondary">
                        Suggest a Link
                    </a>
                </div>
            </div>
        </div>
    );
};

export default UsefulLinks;
