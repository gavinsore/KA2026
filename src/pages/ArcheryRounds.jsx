import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import RoundCard from '../components/RoundCard';
import SEO from '../components/SEO';

const ArcheryRounds = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    const [rounds, setRounds] = useState([]);
    const [loading, setLoading] = useState(true);

    // Categories for filtering
    const categories = [
        { id: 'all', label: 'All Rounds', color: 'bg-charcoal-100 text-charcoal-700 border-charcoal-300' },
        { id: 'indoor', label: 'Indoor', color: 'bg-blue-100 text-blue-700 border-blue-300' },
        { id: 'outdoor', label: 'Outdoor', color: 'bg-forest-100 text-forest-700 border-forest-300' },
        { id: 'clout', label: 'Clout', color: 'bg-purple-100 text-purple-700 border-purple-300' },
        { id: 'field', label: 'Field', color: 'bg-amber-100 text-amber-700 border-amber-300' },
        { id: 'fun', label: 'Fun / Novelty', color: 'bg-pink-100 text-pink-700 border-pink-300' },
    ];

    useEffect(() => {
        fetchRounds();
    }, []);

    const fetchRounds = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('archery_rounds')
                .select('*')
                .order('category', { ascending: true })
                .order('name', { ascending: true });

            if (error) throw error;

            // Map Supabase fields to component props
            const mappedRounds = data.map(round => ({
                ...round,
                isOfficial: round.is_official,
                maxScore: round.max_score,
                distanceBreakdown: round.distance_breakdown
            }));

            setRounds(mappedRounds);
        } catch (error) {
            console.error('Error fetching rounds:', error);
        } finally {
            setLoading(false);
        }
    };
    // Filter rounds based on active filter and sort alphabetically
    const filteredRounds = (activeFilter === 'all'
        ? rounds
        : rounds.filter(round => round.category === activeFilter)
    ).sort((a, b) => a.name.localeCompare(b.name));

    // Get category info for display
    const getCategoryInfo = (categoryId) => {
        return categories.find(c => c.id === categoryId) || categories[0];
    };

    return (
        <div className="min-h-screen py-12 md:py-20">
            <SEO
                title="Archery Rounds | Kettering Archers"
                description="Learn about archery rounds shot in the UK: indoor, outdoor, imperial, metric, and clout. Guide to Portsmouth, WA 1440, York, and other archery formats."
            />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-forest-900 mb-4">
                        Archery <span className="gradient-text">Rounds</span>
                    </h1>
                    <p className="text-charcoal-600 text-lg max-w-2xl mx-auto">
                        Learn about the different types of archery rounds shot in the UK.
                        From indoor to outdoor, imperial, metric - there's a round for everyone.
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveFilter(category.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${activeFilter === category.id
                                ? `${category.color} ring-2 ring-offset-2 ring-forest-500 scale-105`
                                : 'bg-white/50 text-charcoal-600 border-charcoal-200 hover:bg-white hover:border-charcoal-300'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Active Filter Indicator */}
                {activeFilter !== 'all' && (
                    <div className="text-center mb-8">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200 transition-colors text-sm"
                        >
                            <span>Showing: <strong>{getCategoryInfo(activeFilter).label}</strong></span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Results Count */}
                <p className="text-center text-charcoal-500 text-sm mb-8">
                    Showing {filteredRounds.length} round{filteredRounds.length !== 1 ? 's' : ''}
                </p>

                {loading ? (
                    <div className="flex justify-center my-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Rounds Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                            {filteredRounds.map((round) => (
                                <RoundCard
                                    key={round.id || round.name}
                                    round={round}
                                    categoryInfo={getCategoryInfo(round.category)}
                                />
                            ))}
                        </div>

                        {filteredRounds.length === 0 && (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100 mb-16">
                                <p className="text-gray-500 text-lg">No rounds found for this category.</p>
                            </div>
                        )}
                    </>
                )}

                {/* Legend */}
                <div className="glass-card p-6 md:p-8 mb-8">
                    <h3 className="font-semibold text-forest-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Round Categories
                    </h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-forest-800">Imperial</span>
                            <p className="text-charcoal-600">Distances in yards/feet (traditional British)</p>
                        </div>
                        <div>
                            <span className="font-medium text-forest-800">Metric</span>
                            <p className="text-charcoal-600">Distances in metres (World Archery standard)</p>
                        </div>
                        <div>
                            <span className="font-medium text-forest-800">Clout</span>
                            <p className="text-charcoal-600">Long-distance shooting at a ground target</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-charcoal-200 flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-forest-100 text-forest-700 text-xs font-medium border border-forest-300">Official</span>
                            <span className="text-charcoal-600">Archery GB / World Archery recognised</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-gold-100 text-gold-700 text-xs font-medium border border-gold-300">KA Custom</span>
                            <span className="text-charcoal-600">Kettering Archers club rounds</span>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="glass-card p-6 md:p-8 border-forest-500/30">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-forest-900 mb-2">Want to Learn More?</h3>
                            <p className="text-charcoal-600 text-sm leading-relaxed">
                                The rounds listed here are the most common ones shot in the UK. For a complete list of
                                rounds and their rules, visit the{' '}
                                <a
                                    href="https://archerygb.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-forest-600 hover:underline"
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
