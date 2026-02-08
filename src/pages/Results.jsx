import { useState, useEffect } from 'react';
import { loadAllEventResults, loadClubRecords, loadPersonalBests } from '../utils/csvLoader';
import SEO from '../components/SEO';

const Results = () => {
    const [activeTab, setActiveTab] = useState('outdoor');
    const [loading, setLoading] = useState(true);
    const [outdoorResults, setOutdoorResults] = useState([]);
    const [indoorResults, setIndoorResults] = useState([]);
    const [clubRecords, setClubRecords] = useState([]);
    const [personalBests, setPersonalBests] = useState([]);
    const [bowTypeFilter, setBowTypeFilter] = useState('all');

    // Available bow types for filtering
    const bowTypes = ['all', 'Recurve', 'Compound', 'Longbow', 'Barebow', 'Traditional', 'Horsebow'];

    // Parse combined bow_type field (e.g., "Mens Barebow") into category and bowType
    const parseBowType = (bowTypeField) => {
        const field = bowTypeField || '';
        const parts = field.split(' ');
        if (parts.length >= 2) {
            return { category: parts[0], bowType: parts.slice(1).join(' ') };
        }
        return { category: '', bowType: field };
    };

    const tabs = [
        { id: 'outdoor', label: 'Outdoor Season' },
        { id: 'indoor', label: 'Indoor Season' },
        { id: 'records', label: 'Club Records' },
        { id: 'pbs', label: 'Personal Bests' },
        { id: 'archive', label: 'Archive' },
    ];

    const archiveSeasons = [
        { season: '2024-2025 Indoor', description: '24/25 Indoor Results' },
        { season: '2024 Outdoor', description: '2024 Outdoor Results' },
        { season: '2023-2024 Indoor', description: '23/24 Indoor Results' },
        { season: '2023 Outdoor', description: '2023 Outdoor Results' },
        { season: '2022-2023 Indoor', description: '22/23 Indoor Results' },
    ];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [eventResults, records, pbs] = await Promise.all([
                    loadAllEventResults(),
                    loadClubRecords(),
                    loadPersonalBests()
                ]);

                setOutdoorResults(eventResults.outdoor);
                setIndoorResults(eventResults.indoor);
                setClubRecords(records);
                setPersonalBests(pbs);
            } catch (error) {
                console.error('Error loading results:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getBowTypeStyle = (bowType) => {
        const type = bowType?.toLowerCase() || '';
        if (type.includes('recurve')) return 'bg-forest-100 text-forest-600';
        if (type.includes('compound')) return 'bg-gold-100 text-gold-600';
        if (type.includes('longbow')) return 'bg-purple-600/20 text-purple-400';
        if (type.includes('barebow')) return 'bg-blue-600/20 text-blue-400';
        return 'bg-charcoal-100 text-charcoal-600';
    };

    const getCategoryStyle = (category) => {
        const cat = category?.toLowerCase() || '';
        if (cat.includes('female')) return 'bg-pink-600/20 text-pink-400';
        if (cat.includes('50+')) return 'bg-amber-600/20 text-amber-400';
        if (cat.includes('u18') || cat.includes('u16') || cat.includes('u14') || cat.includes('u12')) return 'bg-cyan-600/20 text-cyan-400';
        return 'bg-blue-600/20 text-blue-400';
    };

    const renderEventCard = (event) => {
        // Filter and sort results
        const filteredResults = event.results.filter(result => {
            if (bowTypeFilter === 'all') return true;
            const { bowType } = parseBowType(result.bow_type);
            return bowType.toLowerCase() === bowTypeFilter.toLowerCase();
        });

        // Sort alphabetically by bow type
        const sortedResults = [...filteredResults].sort((a, b) =>
            (a.bow_type || '').localeCompare(b.bow_type || '')
        );

        // Don't render if no results after filtering
        if (sortedResults.length === 0) return null;

        return (
            <div key={event.id} className="mb-8 last:mb-0">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-charcoal-200">
                    <h3 className="text-lg font-semibold text-forest-800">{event.eventName}</h3>
                    <span className="text-charcoal-500 text-sm">{formatDate(event.date)}</span>
                </div>

                {/* Mobile Card Layout */}
                <div className="md:hidden space-y-3">
                    {sortedResults.map((result, index) => {
                        const { category, bowType } = parseBowType(result.bow_type);
                        return (
                            <div key={index} className="bg-white/60 rounded-lg p-4 border border-charcoal-100">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-forest-900 font-semibold">{result.archer_name}</p>
                                        <p className="text-charcoal-500 text-sm">{result.club}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gold-600 font-bold text-lg">{result.score}</p>
                                        <p className="text-charcoal-500 text-xs">Pos: {result.position}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryStyle(category)}`}>
                                        {category}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getBowTypeStyle(bowType)}`}>
                                        {bowType}
                                    </span>
                                    <span className="text-charcoal-500 text-xs ml-auto">
                                        H: {result.hits} | G: {result.golds}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Desktop Table Layout */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left border-b border-charcoal-100">
                                <th className="pb-2 text-charcoal-600 font-medium">Category</th>
                                <th className="pb-2 text-charcoal-600 font-medium">Bow</th>
                                <th className="pb-2 text-charcoal-600 font-medium">Pos</th>
                                <th className="pb-2 text-charcoal-600 font-medium">Archer</th>
                                <th className="pb-2 text-charcoal-600 font-medium">Club</th>
                                <th className="pb-2 text-charcoal-600 font-medium text-right">Score</th>
                                <th className="pb-2 text-charcoal-600 font-medium text-right">Hits</th>
                                <th className="pb-2 text-charcoal-600 font-medium text-right">Golds</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedResults.map((result, index) => {
                                const { category, bowType } = parseBowType(result.bow_type);
                                return (
                                    <tr key={index} className="border-b border-charcoal-50 hover:bg-white/50 transition-colors">
                                        <td className="py-2 text-charcoal-600">{category}</td>
                                        <td className="py-2">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getBowTypeStyle(bowType)}`}>
                                                {bowType}
                                            </span>
                                        </td>
                                        <td className="py-2 text-charcoal-600">{result.position}</td>
                                        <td className="py-2 text-forest-900 font-medium">{result.archer_name}</td>
                                        <td className="py-2 text-charcoal-600">{result.club}</td>
                                        <td className="py-2 text-right text-gold-600 font-semibold">{result.score}</td>
                                        <td className="py-2 text-right text-charcoal-600">{result.hits}</td>
                                        <td className="py-2 text-right text-charcoal-600">{result.golds}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const renderEventsList = (events) => (
        <div className="space-y-6">
            {events.map(event => renderEventCard(event))}
            {events.length === 0 && !loading && (
                <p className="text-center text-charcoal-500 py-8">No results available yet.</p>
            )}
        </div>
    );

    return (
        <div className="min-h-screen py-12 md:py-20">
            <SEO
                title="Results & Records | Kettering Archers"
                description="Club results, records, personal bests and historical archives for Kettering Archers members."
                noindex={true}
            />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-forest-900 mb-4">
                        Results & <span className="gradient-text">Records</span>
                    </h1>
                    <p className="text-charcoal-600 text-lg max-w-2xl mx-auto">
                        View club results, records, personal bests and historical archives.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-forest-600 text-forest-900 shadow-lg shadow-forest-500/30'
                                : 'bg-white text-charcoal-600 hover:text-forest-900 hover:bg-charcoal-100'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Bow Type Filter */}
                <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
                    <span className="text-charcoal-600 text-sm font-medium">Filter by bow:</span>
                    {bowTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => setBowTypeFilter(type)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${bowTypeFilter === type
                                ? 'bg-gold-500 text-white shadow-md'
                                : 'bg-white/70 text-charcoal-600 hover:bg-white hover:text-forest-900'
                                }`}
                        >
                            {type === 'all' ? 'All' : type}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="glass-card p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
                        <p className="text-charcoal-600">Loading results...</p>
                    </div>
                )}

                {/* Content */}
                {!loading && (
                    <div className="glass-card p-6 md:p-8">
                        {/* Outdoor Season */}
                        {activeTab === 'outdoor' && (
                            <div>
                                <h2 className="text-xl font-semibold text-forest-900 mb-6 flex items-center gap-3">
                                    <svg className="w-6 h-6 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    Current Outdoor Season 2026
                                </h2>
                                {renderEventsList(outdoorResults)}
                            </div>
                        )}

                        {/* Indoor Season */}
                        {activeTab === 'indoor' && (
                            <div>
                                <h2 className="text-xl font-semibold text-forest-900 mb-6 flex items-center gap-3">
                                    <svg className="w-6 h-6 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    Current Indoor Season 2025-2026
                                </h2>
                                {renderEventsList(indoorResults)}
                            </div>
                        )}

                        {/* Club Records */}
                        {activeTab === 'records' && (
                            <div>
                                <h2 className="text-xl font-semibold text-forest-900 mb-6 flex items-center gap-3">
                                    <svg className="w-6 h-6 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    Club Records
                                </h2>

                                {/* Mobile Card Layout */}
                                <div className="md:hidden space-y-3">
                                    {clubRecords
                                        .filter(record => {
                                            if (bowTypeFilter === 'all') return true;
                                            return (record.bow_type || '').toLowerCase() === bowTypeFilter.toLowerCase();
                                        })
                                        .map((record, index) => (
                                            <div key={index} className="bg-white/60 rounded-lg p-4 border border-charcoal-100">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="text-forest-800 font-semibold">{record.round}</p>
                                                        <p className="text-forest-900 text-sm">{record.archer_name}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gold-600 font-bold text-lg">{record.score}</p>
                                                        <p className="text-charcoal-500 text-xs">{formatDate(record.date)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getBowTypeStyle(record.bow_type)}`}>
                                                        {record.bow_type}
                                                    </span>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryStyle(record.archer_category)}`}>
                                                        {record.archer_category}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {/* Desktop Table Layout */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-left border-b border-charcoal-200">
                                                <th className="pb-3 text-charcoal-600 font-medium">Round</th>
                                                <th className="pb-3 text-charcoal-600 font-medium">Bow Type</th>
                                                <th className="pb-3 text-charcoal-600 font-medium">Category</th>
                                                <th className="pb-3 text-charcoal-600 font-medium">Holder</th>
                                                <th className="pb-3 text-charcoal-600 font-medium text-right">Score</th>
                                                <th className="pb-3 text-charcoal-600 font-medium text-right">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {clubRecords
                                                .filter(record => {
                                                    if (bowTypeFilter === 'all') return true;
                                                    return (record.bow_type || '').toLowerCase() === bowTypeFilter.toLowerCase();
                                                })
                                                .map((record, index) => (
                                                    <tr key={index} className="border-b border-charcoal-100 hover:bg-white/50 transition-colors">
                                                        <td className="py-3 text-forest-800">{record.round}</td>
                                                        <td className="py-3">
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getBowTypeStyle(record.bow_type)}`}>
                                                                {record.bow_type}
                                                            </span>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryStyle(record.archer_category)}`}>
                                                                {record.archer_category}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-forest-900 font-medium">{record.archer_name}</td>
                                                        <td className="py-3 text-right text-gold-600 font-bold">{record.score}</td>
                                                        <td className="py-3 text-right text-charcoal-600">{formatDate(record.date)}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                                {clubRecords.filter(record => {
                                    if (bowTypeFilter === 'all') return true;
                                    return (record.bow_type || '').toLowerCase() === bowTypeFilter.toLowerCase();
                                }).length === 0 && (
                                        <p className="text-center text-charcoal-500 py-8">
                                            {bowTypeFilter === 'all' ? 'No records available yet.' : `No ${bowTypeFilter} records available.`}
                                        </p>
                                    )}
                            </div>
                        )}

                        {/* Personal Bests */}
                        {activeTab === 'pbs' && (
                            <div>
                                <h2 className="text-xl font-semibold text-forest-900 mb-6 flex items-center gap-3">
                                    <svg className="w-6 h-6 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                    </svg>
                                    Personal Bests
                                </h2>
                                <div className="space-y-8">
                                    {/* Group personal bests by archer */}
                                    {Object.entries(
                                        personalBests.reduce((acc, pb) => {
                                            const name = pb.archer_name || 'Unknown';
                                            if (!acc[name]) acc[name] = [];
                                            acc[name].push(pb);
                                            return acc;
                                        }, {})
                                    ).map(([archerName, pbs]) => (
                                        <div key={archerName} className="mb-8 last:mb-0">
                                            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-charcoal-200">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-forest-600 to-forest-700 flex items-center justify-center text-forest-900 font-bold text-sm">
                                                    {archerName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <h3 className="text-lg font-semibold text-forest-800">{archerName}</h3>
                                            </div>

                                            {/* Mobile Card Layout */}
                                            <div className="md:hidden space-y-3">
                                                {pbs.sort((a, b) => (a.round || '').localeCompare(b.round || '')).map((pb, index) => (
                                                    <div key={index} className="bg-white/60 rounded-lg p-4 border border-charcoal-100">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <p className="text-forest-800 font-semibold">{pb.round}</p>
                                                                <p className="text-charcoal-500 text-sm">{formatDate(pb.date)}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-gold-600 font-bold text-lg">{pb.score}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getBowTypeStyle(pb.bow_type)}`}>
                                                                {pb.bow_type}
                                                            </span>
                                                            <span className="text-charcoal-500 text-xs ml-auto">
                                                                H: {pb.hits} | G: {pb.golds}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Desktop Table Layout */}
                                            <div className="hidden md:block overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="text-left border-b border-charcoal-100">
                                                            <th className="pb-2 text-charcoal-600 font-medium">Round</th>
                                                            <th className="pb-2 text-charcoal-600 font-medium">Bow Type</th>
                                                            <th className="pb-2 text-charcoal-600 font-medium">Date</th>
                                                            <th className="pb-2 text-charcoal-600 font-medium text-right">Score</th>
                                                            <th className="pb-2 text-charcoal-600 font-medium text-right">Hits</th>
                                                            <th className="pb-2 text-charcoal-600 font-medium text-right">Golds</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {pbs.sort((a, b) => (a.round || '').localeCompare(b.round || '')).map((pb, index) => (
                                                            <tr key={index} className="border-b border-charcoal-50 hover:bg-white/50 transition-colors">
                                                                <td className="py-2 text-forest-800">{pb.round}</td>
                                                                <td className="py-2">
                                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getBowTypeStyle(pb.bow_type)}`}>
                                                                        {pb.bow_type}
                                                                    </span>
                                                                </td>
                                                                <td className="py-2 text-charcoal-600">{formatDate(pb.date)}</td>
                                                                <td className="py-2 text-right text-gold-600 font-bold">{pb.score}</td>
                                                                <td className="py-2 text-right text-charcoal-600">{pb.hits}</td>
                                                                <td className="py-2 text-right text-charcoal-600">{pb.golds}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ))}
                                    {personalBests.length === 0 && (
                                        <p className="text-center text-charcoal-500 py-8">No personal bests available yet.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Archive */}
                        {activeTab === 'archive' && (
                            <div>
                                <h2 className="text-xl font-semibold text-forest-900 mb-6 flex items-center gap-3">
                                    <svg className="w-6 h-6 text-charcoal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                    </svg>
                                    Historical Archive
                                </h2>
                                <div className="grid gap-4">
                                    {archiveSeasons.map((season, index) => (
                                        <button
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-white/50 rounded-lg hover:bg-white transition-colors text-left group"
                                        >
                                            <div>
                                                <p className="text-forest-900 font-medium group-hover:text-forest-600 transition-colors">
                                                    {season.season}
                                                </p>
                                                <p className="text-charcoal-600 text-sm">{season.description}</p>
                                            </div>
                                            <svg className="w-5 h-5 text-charcoal-500 group-hover:text-forest-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-charcoal-500 text-sm mt-6 text-center">
                                    Click on a season to view detailed results (coming soon)
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Results;
