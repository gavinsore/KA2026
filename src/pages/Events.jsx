import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';

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
                // Parse event type from description or use default
                let eventType = 'Club Shoot';
                const description = item.description || '';

                if (description.toLowerCase().includes('[competition]')) {
                    eventType = 'Competition';
                } else if (description.toLowerCase().includes('[beginners]')) {
                    eventType = 'Beginners';
                } else if (description.toLowerCase().includes('[open day]')) {
                    eventType = 'Open Day';
                } else if (description.toLowerCase().includes('[social]')) {
                    eventType = 'Social';
                } else if (description.toLowerCase().includes('[practice]')) {
                    eventType = 'Practice';
                } else if (description.toLowerCase().includes('[target]')) {
                    eventType = 'Target';
                } else if (description.toLowerCase().includes('[clout]')) {
                    eventType = 'Clout';
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
                    .replace(/\[(competition|beginners|open day|social|club shoot|practice|clout|indoors)\]/gi, '')
                    .trim();

                return {
                    id: item.id || index,
                    title: item.summary || 'Untitled Event',
                    date: startDate.split('T')[0],
                    time: time,
                    location: item.location || '',
                    description: cleanDescription || item.summary,
                    type: eventType
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
            type: "Club Shoot"
        },
        {
            id: 2,
            title: "Beginners Course - Session 1",
            date: "2026-02-22",
            time: "2:00 PM - 4:00 PM",
            location: "Indoor Range",
            description: "First session of our 6-week beginners course. All equipment provided.",
            type: "Beginners"
        },
        {
            id: 3,
            title: "Portsmouth Indoor Competition",
            date: "2026-03-01",
            time: "9:00 AM - 5:00 PM",
            location: "Indoor Range",
            description: "Indoor Portsmouth round competition. Open to all club members.",
            type: "Competition"
        },
        {
            id: 4,
            title: "Spring Outdoor Opening",
            date: "2026-03-15",
            time: "10:00 AM - 3:00 PM",
            location: "Kettering Sports Ground",
            description: "Outdoor season opening day! Join us for a relaxed shoot to kick off the outdoor season.",
            type: "Club Shoot"
        }
    ];

    // Group events by month
    const groupedEvents = events.reduce((groups, event) => {
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
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Upcoming <span className="gradient-text">Events</span>
                    </h1>
                    <p className="text-charcoal-400 text-lg max-w-2xl mx-auto">
                        Stay up to date with all our club activities, competitions, and social events.
                    </p>
                </div>

                {/* Event Type Legend */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {['Practice', 'Target', 'Clout', 'Club Shoot', 'Competition', 'Beginners', 'Open Day'].map((type) => (
                        <span key={type} className={`px-3 py-1.5 rounded-full text-sm font-medium ${type === 'Club Shoot' ? 'bg-forest-600/20 text-forest-400' :
                            type === 'Competition' ? 'bg-gold-600/20 text-gold-400' :
                                type === 'Beginners' ? 'bg-blue-600/20 text-blue-400' :
                                    type === 'Open Day' ? 'bg-purple-600/20 text-purple-400' :
                                        'bg-pink-600/20 text-pink-400'
                            }`}>
                            {type}
                        </span>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-forest-600 border-t-transparent animate-spin"></div>
                        <p className="text-charcoal-400">Loading events...</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-8 p-4 rounded-lg bg-gold-500/20 border border-gold-500/50 text-gold-400 text-center">
                        {error}
                    </div>
                )}

                {/* No Events */}
                {!loading && events.length === 0 && (
                    <div className="text-center py-20">
                        <svg className="w-16 h-16 mx-auto mb-4 text-charcoal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-charcoal-400">No upcoming events scheduled.</p>
                    </div>
                )}

                {/* Events by Month */}
                {!loading && events.length > 0 && (
                    <div className="space-y-12">
                        {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
                            <div key={monthYear}>
                                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
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
                        <div className="w-12 h-12 rounded-xl bg-forest-600/20 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6 text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-2">Event Information</h3>
                            <p className="text-charcoal-400 text-sm leading-relaxed">
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
