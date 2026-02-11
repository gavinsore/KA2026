import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';

import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeFilter, setActiveFilter] = useState(null);

    const [competitions, setCompetitions] = useState([]);

    useEffect(() => {
        fetchEvents();
        fetchCompetitions();
    }, []);

    const fetchCompetitions = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data, error } = await supabase
                .from('competitions')
                .select('*')
                .eq('is_open', true)
                .gte('date', today)
                .order('date', { ascending: true });

            if (error) throw error;
            setCompetitions(data);
        } catch (err) {
            console.error('Error fetching competitions:', err);
        }
    };

    const fetchEvents = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('events')
                .select('*')
                .gte('date', today)
                .order('date', { ascending: true });

            if (error) throw error;

            // Transform Supabase events to our internal format if needed
            // Currently they are almost identical match, but we handle time formatting
            const transformedEvents = data.map((item) => {
                let timeStr = '';
                if (item.start_time) {
                    timeStr = item.start_time.slice(0, 5);
                    if (item.end_time) {
                        timeStr += ` - ${item.end_time.slice(0, 5)}`;
                    }
                }

                return {
                    id: item.id,
                    title: item.title,
                    date: item.date,
                    time: timeStr,
                    location: item.location || '',
                    description: item.description || '',
                    types: [item.type] // Convert single type to array for compatibility
                };
            });

            setEvents(transformedEvents);
        } catch (err) {
            console.error('Error fetching events:', err);
            setError('Unable to load events. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

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
            <SEO
                title="Events & Calendar | Kettering Archers"
                description="Upcoming archery events, competitions, beginners courses, and club activities at Kettering Archers. Join us for target shooting, clout, and social events."
            />
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

                {/* Open Competitions Section - Fetched from Supabase */}
                {competitions.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-forest-900 mb-6 flex items-center gap-3">
                            <svg className="w-7 h-7 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Open Competitions
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {competitions.map(competition => {
                                const compDate = new Date(competition.date);
                                const closingDate = new Date(competition.closing_date);
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
                                                    {competition.eligible_classes && competition.eligible_classes.slice(0, 3).map(cls => (
                                                        <span key={cls} className="px-2 py-0.5 rounded-full bg-forest-100 text-forest-700 text-xs font-medium">
                                                            {cls}
                                                        </span>
                                                    ))}
                                                    {competition.eligible_classes && competition.eligible_classes.length > 3 && (
                                                        <span className="px-2 py-0.5 rounded-full bg-charcoal-100 text-charcoal-600 text-xs">
                                                            +{competition.eligible_classes.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm">
                                                        <span className="text-charcoal-500">Entry: </span>
                                                        <span className="font-medium text-forest-700">£{competition.entry_fee_adult}</span>
                                                        <span className="text-charcoal-400"> / </span>
                                                        <span className="font-medium text-forest-700">£{competition.entry_fee_junior}</span>
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
                                            to={`/competitions/${competition.slug}`}
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
