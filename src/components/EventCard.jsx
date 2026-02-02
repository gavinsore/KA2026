const EventCard = ({ event }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleString('en-GB', { month: 'short' }),
            year: date.getFullYear(),
        };
    };

    const { day, month, year } = formatDate(event.date);

    return (
        <div className="glass-card p-6 hover:border-forest-500/30 transition-all duration-300 group">
            <div className="flex gap-4">
                {/* Date Badge */}
                <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gradient-to-br from-forest-600 to-forest-700 flex flex-col items-center justify-center text-white shadow-lg group-hover:shadow-forest-500/30 transition-shadow">
                    <span className="text-2xl md:text-3xl font-bold leading-none">{day}</span>
                    <span className="text-xs md:text-sm uppercase tracking-wide">{month}</span>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-1 truncate">
                        {event.title}
                    </h3>
                    <p className="text-charcoal-400 text-sm mb-3 line-clamp-2">
                        {event.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs">
                        {event.time && (
                            <span className="flex items-center gap-1.5 text-charcoal-400">
                                <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {event.time}
                            </span>
                        )}
                        {event.location && (
                            <span className="flex items-center gap-1.5 text-charcoal-400">
                                <svg className="w-4 h-4 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {event.location}
                            </span>
                        )}
                        {event.type && (
                            <span className="px-2 py-1 rounded-full bg-forest-600/20 text-forest-400 font-medium">
                                {event.type}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
