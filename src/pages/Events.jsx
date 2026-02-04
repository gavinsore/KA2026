import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { getOpenCompetitions } from '../data/competitions';

// ============================================================
// GOOGLE CALENDAR CONFIGURATION
// To use Google Calendar for events:
// 1. Create a Google Calendar for your club events
// 2. Make the calendar public (Settings > Access permissions > Make available to public)
// 3. Get the Calendar ID (Settings > Integrate calendar > Calendar ID)
// 4. Get a Google API key from https://console.cloud.google.com/
//    - Create a new project
//    - Enable the Google Calendar API
//    - Create credentials (API key)
//    - Restrict the key to Google Calendar API (recommended)
// 5. Replace these placeholder values:
// ============================================================
const GOOGLE_CALENDAR_ID = 'ketteringarcherstest@gmail.com';
const GOOGLE_API_KEY = 'AIzaSyCla7x5hStgKHGJspQwB82zKvwFfjqkTB4';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        // If not configured, use sample events
        if (GOOGLE_CALENDAR_ID === 'YOUR_CALENDAR_ID@group.calendar.google.com') {
            console.log('Google Calendar not configured. Using sample events.');
            setEvents(getSampleEvents());
            setLoading(false);
            return;
        }

        try {
            const now = new Date().toISOString();
            const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events?key=${GOOGLE_API_KEY}&timeMin=${now}&maxResults=50&singleEvents=true&orderBy=startTime`;

            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Google Calendar API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                throw new Error(`API Error ${response.status}: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();

            // Transform Google Calendar events to our format
            const transformedEvents = data.items.map((item, index) => {
                // Parse event types from description (supports multiple types)
                const description = item.description || '';
                const descLower = description.toLowerCase();
                const eventTypes = [];

                // Check for each type tag
                if (descLower.includes('[competition]')) eventTypes.push('Competition');
                if (descLower.includes('[beginners]')) eventTypes.push('Beginners');
                if (descLower.includes('[open day]')) eventTypes.push('Open Day');
                if (descLower.includes('[social]')) eventTypes.push('Social');
                if (descLower.includes('[practice]')) eventTypes.push('Practice');
                if (descLower.includes('[target]')) eventTypes.push('Target');
                if (descLower.includes('[clout]')) eventTypes.push('Clout');
                if (descLower.includes('[club shoot]')) eventTypes.push('Club Shoot');

                // Default to Club Shoot if no types found
                if (eventTypes.length === 0) {
                    eventTypes.push('Club Shoot');
                }

                // Get start date/time
                const startDate = item.start.dateTime || item.start.date;
                const endDate = item.end.dateTime || item.end.date;

                // Format time if available
                let time = '';
                if (item.start.dateTime) {
                    const startTime = new Date(item.start.dateTime).toLocaleTimeString('en-GB', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                    const endTime = new Date(item.end.dateTime).toLocaleTimeString('en-GB', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                    time = `${startTime} - ${endTime}`;
                }

                // Clean description (remove type tags)
                const cleanDescription = description
                    .replace(/\[(competition|beginners|open day|social|club shoot|practice|clout|target|indoors)\]/gi, '')
                    .trim();

                return {
                    id: item.id || index,
                    title: item.summary || 'Untitled Event',
                    date: startDate.split('T')[0],
                    time: time,
                    location: item.location || '',
                    description: cleanDescription || item.summary,
                    types: eventTypes
                };
            });

            setEvents(transformedEvents);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Unable to load events. Please try again later.');
            // Fall back to sample events on error
            setEvents(getSampleEvents());
        } finally {
            setLoading(false);
        }
    };

    const getSampleEvents = () => [
        {
            id: 1,
            title: "Club Target Day",
            date: "2026-02-15",
            time: "10:00 AM - 4:00 PM",
            location: "Kettering Sports Ground",
            description: "Monthly club target day. All members welcome. Various rounds available.",
            types: ["Club Shoot", "Target"]
        },
        {
            id: 2,
            title: "Beginners Course - Session 1",
            date: "2026-02-22",
            time: "2:00 PM - 4:00 PM",
            location: "Indoor Range",
            description: "First session of our 6-week beginners course. All equipment provided.",
            types: ["Beginners"]
        },
        {
            id: 3,
            title: "Clout Championship",
            date: "2026-03-01",
            time: "9:00 AM - 5:00 PM",
            location: "Kettering Sports Ground",
            description: "Annual clout archery championship. Open to all club members.",
            types: ["Competition", "Clout"]
        },
        {
            id: 4,
            title: "Spring Outdoor Opening",
            date: "2026-03-15",
            time: "10:00 AM - 3:00 PM",
            location: "Kettering Sports Ground",
            description: "Outdoor season opening day! Join us for a relaxed shoot to kick off the outdoor season.",
            types: ["Club Shoot"]
        }
    ];

    // Filter events based on active filter (check if event has the selected type)
    const filteredEvents = activeFilter
        ? events.filter(event => event.types?.includes(activeFilter))
        : events;

    // Group events by month
    const groupedEvents = filteredEvents.reduce((groups, event) => {
        const date = new Date(event.date);
        const monthYear = date.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
        if (!groups[monthYear]) {
            groups[monthYear] = [];
        }
        groups[monthYear].push(event);
        return groups;
    }, {});

    return (
        <div className="min-h-screen py-12 md:py-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-forest-900 mb-4">
                        Upcoming <span className="gradient-text">Events</span>
                    </h1>
                    <p className="text-charcoal-600 text-lg max-w-2xl mx-auto">
                        Stay up to date with all our club activities, competitions, and social events.
                    </p>
                </div>

                {/* Open Competitions Section */}
                {getOpenCompetitions().length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-forest-900 mb-6 flex items-center gap-3">
                            <svg className="w-7 h-7 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Open Competitions
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {getOpenCompetitions().map(competition => {
                                const compDate = new Date(competition.date);
                                const closingDate = new Date(competition.closingDate);
                                const today = new Date();
                                const daysUntilClose = Math.ceil((closingDate - today) / (1000 * 60 * 60 * 24));

                                return (
                                    <div key={competition.id} className="glass-card p-6 border-gold-500/30 hover:border-gold-500 transition-all duration-300">
                                        <div className="flex items-start gap-4">
                                            {/* Date Badge */}
                                            <div className="shrink-0 w-16 h-16 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex flex-col items-center justify-center text-white shadow-md">
                                                <span className="text-xl font-bold leading-none">{compDate.getDate()}</span>
                                                <span className="text-xs uppercase tracking-wide">{compDate.toLocaleString('en-GB', { month: 'short' })}</span>
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-forest-900 mb-1">{competition.name}</h3>
                                                <div className="text-sm text-charcoal-600 mb-2">
                                                    <span className="flex items-center gap-1.5">
                                                        📍 {competition.location}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {competition.eligibleClasses.slice(0, 3).map(cls => (
                                                        <span key={cls} className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 text-xs font-medium">
                                                            {cls}
                                                        </span>
                                                    ))}
                                                    {competition.eligibleClasses.length > 3 && (
                                                        <span className="px-2 py-0.5 rounded-full bg-charcoal-100 text-charcoal-600 text-xs">
                                                            +{competition.eligibleClasses.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm">
                                                        <span className="text-charcoal-500">Entry: </span>
                                                        <span className="font-medium text-forest-700">£{competition.entryFee.adult}</span>
                                                        <span className="text-charcoal-400"> / </span>
                                                        <span className="font-medium text-forest-700">£{competition.entryFee.junior}</span>
                                                        <span className="text-charcoal-500 text-xs ml-1">(junior)</span>
                                                    </div>
                                                    {daysUntilClose > 0 && daysUntilClose <= 7 && (
                                                        <span className="text-xs text-amber-600 font-medium">
                                                            {daysUntilClose} days left!
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/competitions/${competition.id}`}
                                            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 text-white font-medium hover:bg-gold-600 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Enter Competition
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Event Type Legend */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {['Practice', 'Target', 'Clout', 'Club Shoot', 'Competition', 'Beginners', 'Open Day'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setActiveFilter(activeFilter === type ? null : type)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer hover:scale-105 ${type === 'Club Shoot' ? 'bg-forest-100 text-forest-700 border border-forest-300 hover:bg-forest-200' :
                                type === 'Competition' ? 'bg-gold-100 text-gold-700 border border-gold-300 hover:bg-gold-200' :
                                    type === 'Beginners' ? 'bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200' :
                                        type === 'Open Day' ? 'bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200' :
                                            type === 'Practice' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200' :
                                                type === 'Target' ? 'bg-teal-100 text-teal-700 border border-teal-300 hover:bg-teal-200' :
                                                    type === 'Clout' ? 'bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200' :
                                                        'bg-pink-100 text-pink-700 border border-pink-300 hover:bg-pink-200'
                                } ${activeFilter === type ? 'ring-2 ring-offset-2 ring-forest-500 scale-105' : 'opacity-90 hover:opacity-100'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Active Filter Indicator */}
                {activeFilter && (
                    <div className="text-center mb-6">
                        <button
                            onClick={() => setActiveFilter(null)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200 transition-colors text-sm"
                        >
                            <span>Showing: <strong>{activeFilter}</strong></span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-forest-600 border-t-transparent animate-spin"></div>
                        <p className="text-charcoal-600">Loading events...</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-8 p-4 rounded-lg bg-gold-500/20 border border-gold-500/50 text-gold-600 text-center">
                        {error}
                    </div>
                )}

                {/* No Events */}
                {!loading && filteredEvents.length === 0 && (
                    <div className="text-center py-20">
                        <svg className="w-16 h-16 mx-auto mb-4 text-charcoal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-charcoal-600">
                            {activeFilter ? `No ${activeFilter} events found.` : 'No upcoming events scheduled.'}
                        </p>
                        {activeFilter && (
                            <button
                                onClick={() => setActiveFilter(null)}
                                className="mt-4 text-forest-600 hover:text-forest-700 underline text-sm"
                            >
                                Clear filter
                            </button>
                        )}
                    </div>
                )}

                {/* Events by Month */}
                {!loading && filteredEvents.length > 0 && (
                    <div className="space-y-12">
                        {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
                            <div key={monthYear}>
                                <h2 className="text-xl font-semibold text-forest-900 mb-6 flex items-center gap-3">
                                    <span className="w-3 h-3 rounded-full bg-forest-500" />
                                    {monthYear}
                                </h2>
                                <div className="space-y-4">
                                    {monthEvents.map((event, index) => (
                                        <div
                                            key={event.id}
                                            className={`animate-fade-in-up stagger-${(index % 5) + 1}`}
                                            style={{ opacity: 0 }}
                                        >
                                            <EventCard event={event} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-16 glass-card p-6 md:p-8 border-forest-500/30">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-forest-900 mb-2">Event Information</h3>
                            <p className="text-charcoal-600 text-sm leading-relaxed">
                                Most club events are open to all members. Competitions may require pre-registration
                                - please check with the club secretary. Beginners sessions must be booked in advance.
                                For any queries, please contact us via email.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Events;
