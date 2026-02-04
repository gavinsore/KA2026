import { Link } from 'react-router-dom';

const EventCard = ({ event, competitionId }) => {
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
                    <p className="text-charcoal-600 text-sm mb-3 line-clamp-2">
                        {event.description}
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
                            <span key={type} className={`px-2 py-1 rounded-full font-medium ${getTypeColor(type)}`}>
                                {type}
                            </span>
                        ))}
                    </div>

                    {/* Enter Competition Button */}
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
                </div>
            </div>
        </div>
    );
};

export default EventCard;

