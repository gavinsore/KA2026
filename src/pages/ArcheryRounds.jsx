import RoundCard from '../components/RoundCard';

const ArcheryRounds = () => {
    const rounds = {
        target: [
            {
                name: "Portsmouth",
                type: "Target",
                description: "Indoor round shot at 20 yards on a 60cm face. Popular competition round.",
                distances: "20 yards",
                arrows: "60 arrows",
                maxScore: "600"
            },
            {
                name: "WA 18",
                type: "Target",
                description: "World Archery indoor round. Shot on a 40cm triple vertical face.",
                distances: "18 metres",
                arrows: "60 arrows",
                maxScore: "600"
            },
            {
                name: "National",
                type: "Target",
                description: "Traditional British outdoor round. Popular for club competitions.",
                distances: "60, 50 yards",
                arrows: "48 arrows per distance",
                maxScore: "864"
            },
            {
                name: "York / Hereford / Bristol",
                type: "Target",
                description: "Traditional British imperial rounds at various distances for different categories.",
                distances: "100-40 yards (varies by round)",
                arrows: "72 arrows at longest, 48 at others",
                maxScore: "1296"
            },
            {
                name: "WA 1440 (FITA)",
                type: "Target",
                description: "World Archery outdoor round. Shot at 4 distances on 122cm and 80cm faces.",
                distances: "90, 70, 50, 30m (men) / 70, 60, 50, 30m (women)",
                arrows: "36 arrows per distance",
                maxScore: "1440"
            },
            {
                name: "WA 720",
                type: "Target",
                description: "Half of a WA 1440, shot at two distances. Common competition format.",
                distances: "70, 60m or 50, 30m",
                arrows: "36 arrows per distance",
                maxScore: "720"
            },
            {
                name: "Western",
                type: "Target",
                description: "Shorter outdoor round suitable for all abilities.",
                distances: "60, 50 yards",
                arrows: "48 arrows per distance",
                maxScore: "864"
            },
            {
                name: "Windsor",
                type: "Target",
                description: "Traditional outdoor round at medium distances.",
                distances: "60, 50, 40 yards",
                arrows: "36 arrows per distance",
                maxScore: "972"
            }
        ],
        field: [
            {
                name: "WA Field",
                type: "Field",
                description: "Shot over a course with marked distances. 24 targets at various distances.",
                distances: "5-60m (marked)",
                arrows: "3 arrows per target",
                maxScore: "432"
            },
            {
                name: "WA Unmarked",
                type: "Field",
                description: "Similar to WA Field but distances are unmarked - requires distance judging skills.",
                distances: "5-60m (unmarked)",
                arrows: "3 arrows per target",
                maxScore: "432"
            },
            {
                name: "NFAS Big Game",
                type: "Field",
                description: "Shot at 3D animal targets in woodland. Popular with traditional archers.",
                distances: "Various (unmarked)",
                arrows: "Varies",
                maxScore: "Varies"
            }
        ],
        clout: [
            {
                name: "Clout",
                type: "Clout",
                description: "Long distance shooting at a flag (clout) on the ground. Arrows scored by proximity to flag.",
                distances: "180/165/140/125/110 yards (by gender/age)",
                arrows: "36 arrows (varies)",
                maxScore: "180"
            },
            {
                name: "WA Clout",
                type: "Clout",
                description: "World Archery clout format using metric distances.",
                distances: "185/165/125m (by gender/age)",
                arrows: "36 arrows",
                maxScore: "180"
            }
        ],
        other: [
            {
                name: "Flight",
                type: "Flight",
                description: "Distance shooting - aim is to shoot as far as possible. Specialist equipment used.",
                distances: "Maximum distance",
                arrows: "6 arrows",
                maxScore: "N/A (distance measured)"
            },
            {
                name: "Popinjay",
                type: "Other",
                description: "Traditional shooting at 'birds' on a tall mast. Shot vertically upwards.",
                distances: "Vertical (90 feet mast)",
                arrows: "Varies",
                maxScore: "Varies"
            }
        ]
    };

    return (
        <div className="min-h-screen py-12 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Archery <span className="gradient-text">Rounds</span>
                    </h1>
                    <p className="text-charcoal-400 text-lg max-w-2xl mx-auto">
                        Learn about the different types of archery rounds shot in the UK.
                        From indoor to outdoor, target to field - there's a round for everyone.
                    </p>
                </div>

                {/* Target Rounds */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-forest-600/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Target Rounds</h2>
                    </div>
                    <p className="text-charcoal-400 mb-6">
                        Shot at fixed distances on standard target faces. The most common form of archery competition.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {rounds.target.map((round) => (
                            <RoundCard key={round.name} round={round} />
                        ))}
                    </div>
                </section>

                {/* Field Rounds */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gold-600/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Field Rounds</h2>
                    </div>
                    <p className="text-charcoal-400 mb-6">
                        Shot over a woodland or parkland course at varying distances and terrain. Tests distance judging and shooting skills.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {rounds.field.map((round) => (
                            <RoundCard key={round.name} round={round} />
                        ))}
                    </div>
                </section>

                {/* Clout */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Clout</h2>
                    </div>
                    <p className="text-charcoal-400 mb-6">
                        Long-distance shooting at a flag on the ground. Arrows arc high and land near the clout. A unique and exciting discipline.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {rounds.clout.map((round) => (
                            <RoundCard key={round.name} round={round} />
                        ))}
                    </div>
                </section>

                {/* Other */}
                <section className="mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-charcoal-600/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-charcoal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">Other Disciplines</h2>
                    </div>
                    <p className="text-charcoal-400 mb-6">
                        Specialist archery disciplines including flight (distance) and traditional formats.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {rounds.other.map((round) => (
                            <RoundCard key={round.name} round={round} />
                        ))}
                    </div>
                </section>

                {/* Info Box */}
                <div className="glass-card p-6 md:p-8 border-forest-500/30">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-forest-600/20 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6 text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-2">Want to Learn More?</h3>
                            <p className="text-charcoal-400 text-sm leading-relaxed">
                                The rounds listed here are the most common ones shot in the UK. For a complete list of
                                rounds and their rules, visit the{' '}
                                <a
                                    href="https://archerygb.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-forest-400 hover:underline"
                                >
                                    Archery GB website
                                </a>
                                . Our coaches are always happy to explain rounds and help you choose which to shoot.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArcheryRounds;
