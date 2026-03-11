import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { loadAllEventResults, loadClubRecords, loadPersonalBests, loadArchivesIndex, loadArchiveResults, getCurrentSeasons } from '../utils/csvLoader';
import SEO from '../components/SEO';

const Results = () => {
    const [searchParams] = useSearchParams();
    const validTabs = ['outdoor', 'indoor', 'records', 'pbs', 'archive'];
    const tabParam = searchParams.get('tab');
    const roundParam = searchParams.get('round') || '';
    const [activeTab, setActiveTab] = useState(validTabs.includes(tabParam) ? tabParam : 'outdoor');
    const [roundFilter, setRoundFilter] = useState(roundParam);
    const [loading, setLoading] = useState(true);
    const [outdoorResults, setOutdoorResults] = useState([]);
    const [indoorResults, setIndoorResults] = useState([]);
    const [clubRecords, setClubRecords] = useState([]);
    const [clubRecordSet, setClubRecordSet] = useState(new Set());
    const [personalBests, setPersonalBests] = useState([]);
    const [bowTypeFilter, setBowTypeFilter] = useState('all');
    const [expandedArchers, setExpandedArchers] = useState(new Set());
    const [expandedRounds, setExpandedRounds] = useState(new Set());

    // Archive State
    const [archives, setArchives] = useState([]);
    const [selectedArchive, setSelectedArchive] = useState(null);
    const [archiveResults, setArchiveResults] = useState([]);
    const [loadingArchive, setLoadingArchive] = useState(false);

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

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [eventResults, records, pbs, archivesList] = await Promise.all([
                    loadAllEventResults(),
                    loadClubRecords(),
                    loadPersonalBests(),
                    loadArchivesIndex()
                ]);

                const currentSeasons = getCurrentSeasons();

                // Partition DB events into current vs archived
                const currentOutdoor = [];
                const currentIndoor = [];
                const dynamicArchivesMap = {};

                const routeEvent = (event) => {
                    const season = event.season;
                    if (!season) return;
                    if (season.type === 'outdoor' && season.id === currentSeasons.outdoor.id) {
                        currentOutdoor.push(event);
                    } else if (season.type === 'indoor' && season.id === currentSeasons.indoor.id) {
                        currentIndoor.push(event);
                    } else {
                        if (!dynamicArchivesMap[season.id]) {
                            dynamicArchivesMap[season.id] = {
                                id: season.id,
                                name: season.name,
                                type: season.type,
                                startYear: season.startYear,
                                isDynamic: true,
                                events: []
                            };
                        }
                        dynamicArchivesMap[season.id].events.push(event);
                    }
                };

                eventResults.outdoor.forEach(routeEvent);
                eventResults.indoor.forEach(routeEvent);

                setOutdoorResults(currentOutdoor);
                setIndoorResults(currentIndoor);

                // Build merged archives list
                const dynamicArchivesList = Object.values(dynamicArchivesMap);
                const combinedArchivesMap = {};

                dynamicArchivesList.forEach(a => {
                    combinedArchivesMap[a.id] = a;
                });

                archivesList.forEach(a => {
                    if (combinedArchivesMap[a.id]) {
                        combinedArchivesMap[a.id].hasStaticConfig = true;
                        combinedArchivesMap[a.id].staticPath = a.path;
                    } else {
                        combinedArchivesMap[a.id] = {
                            id: a.id,
                            name: a.name,
                            isDynamic: false,
                            hasStaticConfig: true,
                            staticPath: a.path,
                            startYear: parseInt(a.id.match(/\d{4}/)?.[0] || '0')
                        };
                    }
                });

                const finalArchives = Object.values(combinedArchivesMap).sort((a, b) => b.startYear - a.startYear);
                setArchives(finalArchives);

                // Build a set of club record identifiers for fast lookup
                // Key: ArcherName|Round|BowType|Score
                const recordSet = new Set(records.map(r =>
                    `${r.archer_name || ''}|${r.round || ''}|${r.bow_type || ''}|${r.score || ''}`.toLowerCase()
                ));
                setClubRecordSet(recordSet);
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

    const handleArchiveSelect = async (archive) => {
        setLoadingArchive(true);
        setSelectedArchive(archive);
        try {
            let results = [];
            // Load static results if they exist (legacy JSON method)
            if (archive.hasStaticConfig) {
                const staticRes = await loadArchiveResults(archive.staticPath);
                results = [...results, ...staticRes];
            }
            // Add dynamic results (already fetched from DB in loadAllEventResults)
            if (archive.isDynamic) {
                results = [...results, ...archive.events];
            }

            // Sort all by date desc
            results.sort((a, b) => new Date(b.date) - new Date(a.date));
            setArchiveResults(results);
        } catch (error) {
            console.error("Failed to load archive", error);
            setArchiveResults([]);
        } finally {
            setLoadingArchive(false);
        }
    };

    const handleBackToArchives = () => {
        setSelectedArchive(null);
        setArchiveResults([]);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const isClubRecord = (pb) => {
        // Construct the key to check against the set
        // Note: personal-bests.csv usually has bow_type as just "Recurve" whereas club-records might have "Mens Recurve"
        // But based on analysis, club records.csv has 'Bow Type' column like 'Barebow', 'Recurve'.
        // However, let's normalize to be safe.
        // Wait, looking at club-records.csv lines:
        // Line 8: ,,Mark Allison,,151,,Barebow,,06/06/2021,Men,,,
        // Bow Type is 'Barebow'.
        // Personal Bests Key: Archer|Round|Bow|Score

        // Club Records might have slightly different spacing or casing, so we used toLowerCase() in the Set.

        const key = `${pb.archer_name || ''}|${pb.round || ''}|${pb.bow_type || ''}|${pb.score || ''}`.toLowerCase();
        return clubRecordSet.has(key);
    };

    // Returns true if the record's round matches the active roundFilter (bidirectional partial match)
    const matchesRoundFilter = (recordRound) => {
        if (!roundFilter) return true;
        const round = (recordRound || '').toLowerCase();
        const filter = roundFilter.toLowerCase();
        return round.includes(filter) || filter.includes(round);
    };

    const getBowTypeStyle = (bowType) => {
        const type = bowType?.toLowerCase() || '';
        if (type.includes('recurve')) return 'bg-emerald-100 text-emerald-800';
        if (type.includes('compound')) return 'bg-gold-100 text-gold-800';
        if (type.includes('longbow')) return 'bg-purple-100 text-purple-800';
        if (type.includes('barebow')) return 'bg-orange-100 text-orange-800';
        return 'bg-charcoal-100 text-charcoal-700';
    };

    const getCategoryStyle = (category) => {
        const cat = category?.toLowerCase() || '';
        // Female — rose/pink
        if (cat.includes('ladies') || cat.includes('lady') || cat.includes('female') ||
            cat.includes('woman') || cat.includes('women') || cat.includes('girl')) {
            return 'bg-pink-100 text-pink-800';
        }
        // Junior (ungendered or explicit)
        if (cat.includes('u18') || cat.includes('u16') || cat.includes('u14') || cat.includes('u12') || cat.includes('junior')) {
            return 'bg-teal-100 text-teal-800';
        }
        // Senior / Masters
        if (cat.includes('50+') || cat.includes('senior') || cat.includes('master') || cat.includes('veteran')) {
            return 'bg-amber-100 text-amber-800';
        }
        // Male (mens, men, boys, gents, gentleman) — slate/blue
        return 'bg-blue-100 text-blue-900';
    };

    const getPositionDisplay = (position) => {
        const pos = parseInt(position);
        if (isNaN(pos)) return position;

        const baseClasses = "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold";

        if (pos === 1) {
            return (
                <div className={`${baseClasses} bg-yellow-100 text-yellow-700 border border-yellow-300`} title="Gold">
                    1
                </div>
            );
        }
        if (pos === 2) {
            return (
                <div className={`${baseClasses} bg-slate-100 text-slate-600 border border-slate-300`} title="Silver">
                    2
                </div>
            );
        }
        if (pos === 3) {
            return (
                <div className={`${baseClasses} bg-orange-100 text-orange-700 border border-orange-300`} title="Bronze">
                    3
                </div>
            );
        }
        return <span className="text-charcoal-600 pl-2">{position}</span>;
    };

    const renderEventCard = (event) => {
        // Filter results
        const filteredResults = event.results.filter(result => {
            if (bowTypeFilter === 'all') return true;
            const { bowType } = parseBowType(result.bow_type);
            return bowType.toLowerCase() === bowTypeFilter.toLowerCase();
        });

        // Group by bow_type, preserving position order within each group
        const grouped = filteredResults.reduce((acc, result) => {
            const key = result.bow_type || 'Unknown';
            if (!acc[key]) acc[key] = [];
            acc[key].push(result);
            return acc;
        }, {});

        // Sort groups alphabetically by bow_type key
        const sortedGroups = Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));

        return (
            <div key={event.id} className="mb-8 last:mb-0">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-charcoal-200">
                    <h3 className="text-base font-semibold text-forest-800">{event.eventName}</h3>
                    <div className="flex items-center gap-3">
                        <span className="text-charcoal-500 text-xs">{formatDate(event.date)}</span>
                        {event.fileUrl && (
                            <a
                                href={event.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-forest-600 hover:text-forest-800 flex items-center gap-1"
                                title="Download Result File"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                            </a>
                        )}
                    </div>
                </div>

                {/* Show Download Button if no parsed results (e.g. PDF) */}
                {filteredResults.length === 0 && event.fileUrl ? (
                    <div className="bg-white/60 rounded-lg p-6 border border-charcoal-100 text-center">
                        <p className="text-charcoal-600 mb-4">Detailed breakdown not available for this format.</p>
                        <a
                            href={event.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Results File
                        </a>
                    </div>
                ) : filteredResults.length === 0 ? (
                    <p className="text-charcoal-500 italic text-sm">No results found.</p>
                ) : (
                    <>
                        {/* ── Mobile: compact grouped list ── */}
                        <div className="md:hidden">
                            {sortedGroups.map(([bowTypeKey, results]) => {
                                const { category, bowType } = parseBowType(bowTypeKey);
                                return (
                                    <div key={bowTypeKey} className="mb-3 last:mb-0">
                                        {/* Category header */}
                                        <div className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold mb-1 ${getBowTypeStyle(bowType)}`}>
                                            {category && <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getCategoryStyle(category)}`}>{category}</span>}
                                            {bowType}
                                        </div>
                                        {/* Result rows */}
                                        {results.map((result, i) => (
                                            <div key={i} className="flex items-center gap-2 px-2 py-1 border-b border-charcoal-50 last:border-0">
                                                <div className="shrink-0 w-6 flex justify-center">{getPositionDisplay(result.position)}</div>
                                                <span className="flex-1 text-sm text-forest-900 font-medium truncate">{result.archer_name}</span>
                                                <span className="text-xs text-charcoal-400 shrink-0">H:{result.hits} G:{result.golds}</span>
                                                <span className="text-gold-600 font-bold text-sm shrink-0 w-12 text-right">{result.score}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>

                        {/* ── Desktop: grouped table ── */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b border-charcoal-100">
                                        <th className="pb-2 text-charcoal-600 font-medium w-10">Pos</th>
                                        <th className="pb-2 text-charcoal-600 font-medium">Archer</th>
                                        <th className="pb-2 text-charcoal-600 font-medium">Club</th>
                                        <th className="pb-2 text-charcoal-600 font-medium">Round</th>
                                        <th className="pb-2 text-charcoal-600 font-medium text-right">Hits</th>
                                        <th className="pb-2 text-charcoal-600 font-medium text-right">Golds</th>
                                        <th className="pb-2 text-charcoal-600 font-medium text-right">Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedGroups.map(([bowTypeKey, results]) => {
                                        const { category, bowType } = parseBowType(bowTypeKey);
                                        return (
                                            <React.Fragment key={bowTypeKey}>
                                                {/* Group header row */}
                                                <tr key={`header-${bowTypeKey}`} className="bg-charcoal-50/60">
                                                    <td colSpan={7} className="py-1.5 px-2">
                                                        <div className="flex items-center gap-2">
                                                            {category && <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getCategoryStyle(category)}`}>{category}</span>}
                                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getBowTypeStyle(bowType)}`}>{bowType}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {results.map((result, i) => (
                                                    <tr key={`${bowTypeKey}-${i}`} className="border-b border-charcoal-50 hover:bg-white/50 transition-colors">
                                                        <td className="py-1.5 pl-2">{getPositionDisplay(result.position)}</td>
                                                        <td className="py-1.5 text-forest-900 font-medium">{result.archer_name}</td>
                                                        <td className="py-1.5 text-charcoal-600">{result.club}</td>
                                                        <td className="py-1.5 text-charcoal-600">{result.round}</td>
                                                        <td className="py-1.5 text-right text-charcoal-600">{result.hits}</td>
                                                        <td className="py-1.5 text-right text-charcoal-600">{result.golds}</td>
                                                        <td className="py-1.5 text-right text-gold-600 font-semibold">{result.score}</td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        );
    };

    const renderEventsList = (events) => (
        <div className="space-y-6">
            {events.map(event => renderEventCard(event))}
            {events.length === 0 && !loading && !loadingArchive && (
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
                            onClick={() => {
                                setActiveTab(tab.id);
                                if (tab.id !== 'archive') {
                                    setSelectedArchive(null);
                                    setArchiveResults([]);
                                }
                            }}
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
                                    Current {getCurrentSeasons().outdoor.name}
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
                                    Current {getCurrentSeasons().indoor.name}
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

                                {/* Active round filter indicator */}
                                {roundFilter && (
                                    <div className="flex items-center gap-3 mb-5 px-4 py-2.5 rounded-lg bg-forest-50 border border-forest-200">
                                        <svg className="w-4 h-4 text-forest-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                                        </svg>
                                        <span className="text-sm text-forest-700">Showing records for: <strong>{roundFilter}</strong></span>
                                        <button
                                            onClick={() => setRoundFilter('')}
                                            className="ml-auto text-xs text-charcoal-500 hover:text-forest-700 flex items-center gap-1 transition-colors"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Show all
                                        </button>
                                    </div>
                                )}

                                {/* Grouped by round — collapsible */}
                                {(() => {
                                    const filteredRecords = clubRecords.filter(record => {
                                        if (bowTypeFilter !== 'all' && (record.bow_type || '').toLowerCase() !== bowTypeFilter.toLowerCase()) return false;
                                        return matchesRoundFilter(record.round);
                                    });

                                    if (filteredRecords.length === 0) {
                                        return (
                                            <p className="text-center text-charcoal-500 py-8">
                                                {roundFilter
                                                    ? `No records found matching "${roundFilter}".`
                                                    : bowTypeFilter === 'all' ? 'No records available yet.' : `No ${bowTypeFilter} records available.`}
                                            </p>
                                        );
                                    }

                                    // Group by round name
                                    const byRound = filteredRecords.reduce((acc, r) => {
                                        const key = r.round || 'Unknown';
                                        if (!acc[key]) acc[key] = [];
                                        acc[key].push(r);
                                        return acc;
                                    }, {});

                                    return Object.entries(byRound).map(([roundName, records]) => {
                                        const isOpen = expandedRounds.has(roundName);
                                        const toggle = () => setExpandedRounds(prev => {
                                            const next = new Set(prev);
                                            next.has(roundName) ? next.delete(roundName) : next.add(roundName);
                                            return next;
                                        });

                                        return (
                                            <div key={roundName} className="border border-charcoal-100 rounded-lg overflow-hidden mb-1 last:mb-0">
                                                {/* Round header */}
                                                <button
                                                    onClick={toggle}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 bg-white/60 hover:bg-white/80 transition-colors text-left"
                                                >
                                                    <svg className="w-4 h-4 text-gold-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                    </svg>
                                                    <span className="flex-1 text-sm font-semibold text-forest-800">{roundName}</span>
                                                    <span className="text-xs text-charcoal-400 mr-1">{records.length} record{records.length !== 1 ? 's' : ''}</span>
                                                    <svg
                                                        className={`w-4 h-4 text-charcoal-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>

                                                {/* Expanded content */}
                                                {isOpen && (
                                                    <div className="px-3 py-2 bg-white/30">
                                                        {/* Scrollable table for all devices */}
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-sm min-w-[600px]">
                                                                <thead>
                                                                    <tr className="text-left border-b border-charcoal-100">
                                                                        <th className="pb-1.5 text-charcoal-600 font-medium whitespace-nowrap pr-4">Archer Name</th>
                                                                        <th className="pb-1.5 text-charcoal-600 font-medium whitespace-nowrap pr-4">Score</th>
                                                                        <th className="pb-1.5 text-charcoal-600 font-medium whitespace-nowrap pr-4">Bow Type</th>
                                                                        <th className="pb-1.5 text-charcoal-600 font-medium whitespace-nowrap pr-4">Date</th>
                                                                        <th className="pb-1.5 text-charcoal-600 font-medium whitespace-nowrap">Category</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {records.map((record, i) => (
                                                                        <tr key={i} className="border-b border-charcoal-50 hover:bg-white/50 transition-colors">
                                                                            <td className="py-1.5 text-forest-900 font-medium whitespace-nowrap pr-4">{record.archer_name}</td>
                                                                            <td className="py-1.5 text-gold-600 font-bold pr-4">{record.score}</td>
                                                                            <td className="py-1.5 whitespace-nowrap pr-4">
                                                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getBowTypeStyle(record.bow_type)}`}>{record.bow_type}</span>
                                                                            </td>
                                                                            <td className="py-1.5 text-charcoal-600 whitespace-nowrap pr-4">{formatDate(record.date)}</td>
                                                                            <td className="py-1.5 whitespace-nowrap">
                                                                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getCategoryStyle(record.archer_category)}`}>{record.archer_category}</span>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    });
                                })()}
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
                                        <div key={archerName} className="border border-charcoal-100 rounded-lg overflow-hidden mb-1 last:mb-0">
                                            {/* Archer header — click to expand/collapse */}
                                            <button
                                                onClick={() => setExpandedArchers(prev => {
                                                    const next = new Set(prev);
                                                    next.has(archerName) ? next.delete(archerName) : next.add(archerName);
                                                    return next;
                                                })}
                                                className="w-full flex items-center gap-3 px-4 py-3 bg-white/60 hover:bg-white/80 transition-colors text-left"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-forest-600 to-forest-700 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                                    {archerName.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <h3 className="flex-1 text-base font-semibold text-forest-800">{archerName}</h3>
                                                {(() => {
                                                    const crCount = pbs.filter(pb => isClubRecord(pb)).length; return crCount > 0 ? (
                                                        <span className="hidden md:inline-flex items-center gap-1 bg-gold-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded mr-1">
                                                            {crCount} CR{crCount !== 1 ? 's' : ''}
                                                        </span>
                                                    ) : null;
                                                })()}
                                                <span className="text-xs text-charcoal-400 mr-1">{pbs.length} PB{pbs.length !== 1 ? 's' : ''}</span>
                                                <svg
                                                    className={`w-4 h-4 text-charcoal-400 transition-transform duration-200 ${expandedArchers.has(archerName) ? 'rotate-180' : ''}`}
                                                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Expandable content */}
                                            {expandedArchers.has(archerName) && (
                                                <div className="px-3 py-2 bg-white/30">
                                                    {/* Scrollable Table Layout for all devices */}
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-sm min-w-[600px]">
                                                            <thead>
                                                                <tr className="text-left border-b border-charcoal-100">
                                                                    <th className="pb-2 text-charcoal-600 font-medium whitespace-nowrap">Round</th>
                                                                    <th className="pb-2 text-charcoal-600 font-medium whitespace-nowrap">Bow Type</th>
                                                                    <th className="pb-2 text-charcoal-600 font-medium whitespace-nowrap">Date</th>
                                                                    <th className="pb-2 text-charcoal-600 font-medium text-right">Score</th>
                                                                    <th className="pb-2 text-charcoal-600 font-medium text-right">Hits</th>
                                                                    <th className="pb-2 text-charcoal-600 font-medium text-right">Golds</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {pbs.sort((a, b) => new Date(b.date) - new Date(a.date)).map((pb, i) => (
                                                                    <tr key={i} className="border-b border-charcoal-50 hover:bg-white/50 transition-colors">
                                                                        <td className="py-2 text-forest-900 font-medium whitespace-nowrap pr-4">
                                                                            <div className="flex items-center gap-2">
                                                                                {pb.round}
                                                                                {isClubRecord(pb) && (
                                                                                    <span className="bg-gold-400 text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded" title="Current Club Record">CR</span>
                                                                                )}
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-2 whitespace-nowrap">
                                                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getBowTypeStyle(pb.bow_type)}`}>{pb.bow_type}</span>
                                                                        </td>
                                                                        <td className="py-2 text-charcoal-600 whitespace-nowrap pr-4">{formatDate(pb.date)}</td>
                                                                        <td className="py-2 text-right text-gold-600 font-bold">{pb.score || '-'}</td>
                                                                        <td className="py-2 text-right text-charcoal-600">{pb.hits || '-'}</td>
                                                                        <td className="py-2 text-right text-charcoal-600">{pb.golds || '-'}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}
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
                                {!selectedArchive ? (
                                    <>
                                        <h2 className="text-xl font-semibold text-forest-900 mb-6 flex items-center gap-3">
                                            <svg className="w-6 h-6 text-charcoal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                            </svg>
                                            Historical Archive
                                        </h2>
                                        {archives.length === 0 ? (
                                            <p className="text-center text-charcoal-500 py-8">No archived results available.</p>
                                        ) : (
                                            <div className="grid gap-4">
                                                {archives.map((archive) => (
                                                    <button
                                                        key={archive.id}
                                                        onClick={() => handleArchiveSelect(archive)}
                                                        className="flex items-center justify-between p-4 bg-white/50 rounded-lg hover:bg-white transition-colors text-left group"
                                                    >
                                                        <div>
                                                            <p className="text-forest-900 font-medium group-hover:text-forest-600 transition-colors">
                                                                {archive.name}
                                                            </p>
                                                            {/* <p className="text-charcoal-600 text-sm">{archive.path}</p> */}
                                                        </div>
                                                        <svg className="w-5 h-5 text-charcoal-500 group-hover:text-forest-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <button
                                                onClick={handleBackToArchives}
                                                className="p-2 -ml-2 rounded-full hover:bg-white/50 text-charcoal-600 transition-colors"
                                            >
                                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <h2 className="text-xl font-semibold text-forest-900 flex items-center gap-3">
                                                <svg className="w-6 h-6 text-charcoal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                </svg>
                                                {selectedArchive.name}
                                            </h2>
                                        </div>

                                        {loadingArchive ? (
                                            <div className="text-center py-12">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600 mx-auto mb-4"></div>
                                                <p className="text-charcoal-600">Loading archived results...</p>
                                            </div>
                                        ) : (
                                            renderEventsList(archiveResults)
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Results;
