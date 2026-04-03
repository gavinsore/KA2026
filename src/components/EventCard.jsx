import { Link } from 'react-router-dom';

const EventCard = ({ event, competitionId, clubRecordsUrl, roundDetails }) => {

    // Derive total arrows and primary distance from a matched round
    const getRoundSummary = (round) => {
        if (!round) return null;

        // Total arrow count
        let totalArrows = round.arrows;
        if (!totalArrows && round.distance_breakdown?.length) {
            totalArrows = round.distance_breakdown.reduce((sum, d) => sum + (d.arrows || 0), 0);
        }

        // Primary distance label
        let primaryDistance = null;
        if (round.distance_breakdown?.length) {
            // If all distances are the same, show once; otherwise show the first
            const unique = [...new Set(round.distance_breakdown.map(d => d.distance))];
            primaryDistance = unique.length === 1 ? unique[0] : unique.join(' / ');
        } else if (round.distances) {
            primaryDistance = round.distances;
        }

        return {
            arrows: totalArrows,
            distance: primaryDistance,
            measurement: round.measurement,
            maxScore: round.max_score,
        };
    };

    const roundSummary = getRoundSummary(roundDetails);
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('en-GB', { month: 'short' }),
            year: date.getFullYear(),
        };
    };

    const { day, month } = formatDate(event.date);

    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'competition':
                return 'bg-gold-100 text-gold-700 border border-gold-300';
            case 'away competition':
                return 'bg-orange-100 text-orange-700 border border-orange-300';
            case 'beginners':
                return 'bg-blue-100 text-blue-700 border border-blue-300';
            case 'open day':
                return 'bg-purple-100 text-purple-700 border border-purple-300';
            case 'social':
                return 'bg-pink-100 text-pink-700 border border-pink-300';
            case 'practice':
                return 'bg-forest-100 text-forest-700 border border-forest-300';
            case 'target':
                return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
            case 'clout':
                return 'bg-amber-100 text-amber-700 border border-amber-300';
            default:
                return 'bg-forest-100 text-forest-700 border border-forest-300';
        }
    };

    const isCompetition = event.types?.some(type => type.toLowerCase() === 'competition');
    const isAwayCompetition = event.types?.some(type => type.toLowerCase() === 'away competition');

    return (
        <div className="glass-card p-6 hover:border-forest-400 hover:shadow-lg transition-all duration-300 group">
            <div className="flex gap-4">
                {/* Date Badge */}
                <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br from-forest-500 to-forest-600 flex flex-col items-center justify-center text-white shadow-md group-hover:shadow-forest-500/40 transition-shadow">
                    <span className="text-2xl md:text-3xl font-bold leading-none">{day}</span>
                    <span className="text-xs md:text-sm uppercase tracking-wide">{month}</span>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-semibold text-forest-900 mb-1 truncate">
                        {event.title}
                    </h3>
                    <p className="text-charcoal-600 text-sm mb-3 ">
                        {event.description?.split('|').map((line, index, arr) => (
                            <span key={index}>
                                {line.trim()}
                                {index < arr.length - 1 && <br />}
                            </span>
                        ))}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                        {event.time && (
                            <span className="flex items-center gap-1.5 text-charcoal-600">
                                <svg className="w-4 h-4 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {event.time}
                            </span>
                        )}
                        {event.location && (
                            <span className="flex items-center gap-1.5 text-charcoal-600">
                                <svg className="w-4 h-4 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {event.location}
                            </span>
                        )}
                        {event.types?.map((type) => (
                            // Only show type badge here when there's no round detail strip
                            !roundSummary && (
                                <span key={type} className={`px-2 py-1 rounded-full font-medium ${getTypeColor(type)}`}>
                                    {type}
                                </span>
                            )
                        ))}
                        {/* Discipline badge for Away Competitions */}
                        {isAwayCompetition && event.discipline && (
                            <span className="px-2 py-1 rounded-full font-medium bg-orange-50 text-orange-600 border border-orange-200">
                                {event.discipline === 'Clout' ? '🏹 Clout' : '🎯 Target'}
                            </span>
                        )}
                    </div>

                    {/* Round Detail Pills */}
                    {roundSummary && (
                        <div className="flex flex-wrap items-center gap-2 mt-3 p-2.5 rounded-lg bg-forest-50/70 border border-forest-200/60">
                            {/* Type badge lives here when round details are shown */}
                            {event.types?.map((type) => (
                                <span key={type} className={`px-2 py-1 rounded-full font-medium text-xs ${getTypeColor(type)}`}>
                                    {type}
                                </span>
                            ))}
                            {roundSummary.arrows && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-forest-200 text-xs text-forest-800 font-medium">
                                    🏹 {roundSummary.arrows} arrows
                                </span>
                            )}
                            {roundSummary.distance && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-forest-200 text-xs text-forest-800 font-medium">
                                    📏 {roundSummary.distance}
                                </span>
                            )}
                            {roundSummary.measurement && (
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                                    roundSummary.measurement === 'imperial'
                                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                                        : 'bg-sky-50 text-sky-700 border-sky-200'
                                }`}>
                                    {roundSummary.measurement === 'imperial' ? 'Imperial' : 'Metric'}
                                </span>
                            )}
                            {roundSummary.maxScore && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-forest-200 text-xs text-forest-800 font-medium">
                                    🏆 Max {roundSummary.maxScore}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Enter Competition Button — our own club comps only */}
                    {isCompetition && competitionId && (
                        <div className="mt-4">
                            <Link
                                to={`/competitions/${competitionId}`}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-500 text-white font-medium text-sm hover:bg-gold-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Enter Competition
                            </Link>
                        </div>
                    )}

                    {/* Visit Club Website — Away Competition only */}
                    {isAwayCompetition && event.external_url && (
                        <div className="mt-4">
                            <a
                                href={event.external_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white font-medium text-sm hover:bg-orange-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                Visit Club Website
                            </a>
                        </div>
                    )}

                    {/* View Club Records + Round Details Buttons — shown for regular non-competition events */}
                    {!isCompetition && !isAwayCompetition && (clubRecordsUrl || roundSummary) && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {clubRecordsUrl && (
                                <Link
                                    to={clubRecordsUrl}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-forest-600 text-white font-medium text-sm hover:bg-forest-700 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    View Club Records
                                </Link>
                            )}
                            {roundSummary && (
                                <Link
                                    to="/rounds"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-charcoal-100 text-charcoal-700 font-medium text-sm hover:bg-charcoal-200 transition-colors border border-charcoal-200"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Round Details
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EventCard;
