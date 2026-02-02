import { useState } from 'react';

const Results = () => {
    const [activeTab, setActiveTab] = useState('outdoor');

    const tabs = [
        { id: 'outdoor', label: 'Outdoor Season' },
        { id: 'indoor', label: 'Indoor Season' },
        { id: 'records', label: 'Club Records' },
        { id: 'pbs', label: 'Personal Bests' },
        { id: 'archive', label: 'Archive' },
    ];

    // Sample data - would be replaced with real data
    const outdoorResults = [
        { date: '2026-01-19', event: 'Western', archer: 'J. Smith', bowType: 'Recurve', score: 756, hits: 94, golds: 32 },
        { date: '2026-01-12', event: 'National', archer: 'M. Johnson', bowType: 'Compound', score: 812, hits: 96, golds: 48 },
        { date: '2026-01-12', event: 'National', archer: 'S. Williams', bowType: 'Recurve', score: 698, hits: 91, golds: 24 },
        { date: '2026-01-05', event: 'Short Metric', archer: 'A. Brown', bowType: 'Longbow', score: 456, hits: 72, golds: 8 },
        { date: '2026-01-05', event: 'Short Metric', archer: 'K. Davies', bowType: 'Barebow', score: 521, hits: 78, golds: 12 },
    ];

    const indoorResults = [
        { date: '2026-01-26', event: 'Portsmouth', archer: 'J. Smith', bowType: 'Recurve', score: 548, hits: 60, golds: 38 },
        { date: '2026-01-26', event: 'Portsmouth', archer: 'M. Johnson', bowType: 'Compound', score: 582, hits: 60, golds: 52 },
        { date: '2026-01-19', event: 'WA 18', archer: 'S. Williams', bowType: 'Recurve', score: 512, hits: 59, golds: 28 },
        { date: '2026-01-19', event: 'WA 18', archer: 'A. Brown', bowType: 'Longbow', score: 389, hits: 54, golds: 6 },
        { date: '2026-01-12', event: 'Portsmouth', archer: 'K. Davies', bowType: 'Barebow', score: 476, hits: 58, golds: 18 },
    ];

    const clubRecords = [
        { round: 'Portsmouth', bowType: 'Recurve', gender: 'M', archer: 'J. Smith', score: 572, year: 2025 },
        { round: 'Portsmouth', bowType: 'Recurve', gender: 'W', archer: 'E. Taylor', score: 561, year: 2024 },
        { round: 'Portsmouth', bowType: 'Compound', gender: 'M', archer: 'M. Johnson', score: 592, year: 2025 },
        { round: 'Portsmouth', bowType: 'Compound', gender: 'W', archer: 'L. Anderson', score: 584, year: 2024 },
        { round: 'York', bowType: 'Recurve', gender: 'M', archer: 'P. Thompson', score: 986, year: 2023 },
        { round: 'Hereford', bowType: 'Recurve', gender: 'W', archer: 'C. Roberts', score: 921, year: 2024 },
        { round: 'National', bowType: 'Recurve', gender: 'M', archer: 'J. Smith', score: 756, year: 2025 },
        { round: 'National', bowType: 'Longbow', gender: 'M', archer: 'A. Brown', score: 412, year: 2024 },
        { round: 'WA 1440', bowType: 'Recurve', gender: 'M', archer: 'D. Wilson', score: 1198, year: 2023 },
        { round: 'WA 1440', bowType: 'Compound', gender: 'M', archer: 'M. Johnson', score: 1356, year: 2024 },
    ];

    const personalBests = [
        { archer: 'J. Smith', round: 'Portsmouth', score: 572, date: '2025-11-15', improvement: '+8' },
        { archer: 'M. Johnson', round: 'WA 18', score: 576, date: '2025-12-01', improvement: '+4' },
        { archer: 'S. Williams', round: 'National', score: 698, date: '2026-01-12', improvement: '+12' },
        { archer: 'A. Brown', round: 'Short Metric', score: 456, date: '2026-01-05', improvement: '+24' },
        { archer: 'K. Davies', round: 'Portsmouth', score: 502, date: '2025-12-08', improvement: '+18' },
    ];

    const archiveSeasons = [
        { season: '2024-2025 Indoor', description: 'Portsmouth League, WA 18 Championship' },
        { season: '2024 Outdoor', description: 'Club Championship, County Records' },
        { season: '2023-2024 Indoor', description: 'Portsmouth League, Indoor Championship' },
        { season: '2023 Outdoor', description: 'Outdoor Season Results' },
        { season: '2022-2023 Indoor', description: 'Indoor Season Archive' },
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="min-h-screen py-12 md:py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Results & <span className="gradient-text">Records</span>
                    </h1>
                    <p className="text-charcoal-400 text-lg max-w-2xl mx-auto">
                        View club results, records, personal bests and historical archives.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-forest-600 text-white shadow-lg shadow-forest-500/30'
                                    : 'bg-charcoal-800 text-charcoal-300 hover:text-white hover:bg-charcoal-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="glass-card p-6 md:p-8">
                    {/* Outdoor Season */}
                    {activeTab === 'outdoor' && (
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                                <svg className="w-6 h-6 text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                Current Outdoor Season 2026
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left border-b border-charcoal-700">
                                            <th className="pb-3 text-charcoal-400 font-medium">Date</th>
                                            <th className="pb-3 text-charcoal-400 font-medium">Round</th>
                                            <th className="pb-3 text-charcoal-400 font-medium">Archer</th>
                                            <th className="pb-3 text-charcoal-400 font-medium">Bow</th>
                                            <th className="pb-3 text-charcoal-400 font-medium text-right">Score</th>
                                            <th className="pb-3 text-charcoal-400 font-medium text-right">Hits</th>
                                            <th className="pb-3 text-charcoal-400 font-medium text-right">Golds</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {outdoorResults.map((result, index) => (
                                            <tr key={index} className="border-b border-charcoal-800 hover:bg-charcoal-800/50 transition-colors">
                                                <td className="py-3 text-charcoal-300">{formatDate(result.date)}</td>
                                                <td className="py-3 text-charcoal-200">{result.event}</td>
                                                <td className="py-3 text-white font-medium">{result.archer}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${result.bowType === 'Recurve' ? 'bg-forest-600/20 text-forest-400' :
                                                            result.bowType === 'Compound' ? 'bg-gold-600/20 text-gold-400' :
                                                                result.bowType === 'Longbow' ? 'bg-purple-600/20 text-purple-400' :
                                                                    'bg-blue-600/20 text-blue-400'
                                                        }`}>
                                                        {result.bowType}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right text-gold-400 font-semibold">{result.score}</td>
                                                <td className="py-3 text-right text-charcoal-300">{result.hits}</td>
                                                <td className="py-3 text-right text-charcoal-300">{result.golds}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Indoor Season */}
                    {activeTab === 'indoor' && (
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                                <svg className="w-6 h-6 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Current Indoor Season 2025-2026
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left border-b border-charcoal-700">
                                            <th className="pb-3 text-charcoal-400 font-medium">Date</th>
                                            <th className="pb-3 text-charcoal-400 font-medium">Round</th>
                                            <th className="pb-3 text-charcoal-400 font-medium">Archer</th>
                                            <th className="pb-3 text-charcoal-400 font-medium">Bow</th>
                                            <th className="pb-3 text-charcoal-400 font-medium text-right">Score</th>
                                            <th className="pb-3 text-charcoal-400 font-medium text-right">Hits</th>
                                            <th className="pb-3 text-charcoal-400 font-medium text-right">Golds</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {indoorResults.map((result, index) => (
                                            <tr key={index} className="border-b border-charcoal-800 hover:bg-charcoal-800/50 transition-colors">
                                                <td className="py-3 text-charcoal-300">{formatDate(result.date)}</td>
                                                <td className="py-3 text-charcoal-200">{result.event}</td>
                                                <td className="py-3 text-white font-medium">{result.archer}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${result.bowType === 'Recurve' ? 'bg-forest-600/20 text-forest-400' :
                                                            result.bowType === 'Compound' ? 'bg-gold-600/20 text-gold-400' :
                                                                result.bowType === 'Longbow' ? 'bg-purple-600/20 text-purple-400' :
                                                                    'bg-blue-600/20 text-blue-400'
                                                        }`}>
                                                        {result.bowType}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-right text-gold-400 font-semibold">{result.score}</td>
                                                <td className="py-3 text-right text-charcoal-300">{result.hits}</td>
                                                <td className="py-3 text-right text-charcoal-300">{result.golds}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Club Records */}
                    {activeTab === 'records' && (
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                                <svg className="w-6 h-6 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                Club Records
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left border-b border-charcoal-700">
                                            <th className="pb-3 text-charcoal-400 font-medium">Round</th>
                                            <th className="pb-3 text-charcoal-400 font-medium">Bow Type</th>
                                            <th className="pb-3 text-charcoal-400 font-medium">Cat.</th>
                                            <th className="pb-3 text-charcoal-400 font-medium">Holder</th>
                                            <th className="pb-3 text-charcoal-400 font-medium text-right">Score</th>
                                            <th className="pb-3 text-charcoal-400 font-medium text-right">Year</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clubRecords.map((record, index) => (
                                            <tr key={index} className="border-b border-charcoal-800 hover:bg-charcoal-800/50 transition-colors">
                                                <td className="py-3 text-charcoal-200">{record.round}</td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${record.bowType === 'Recurve' ? 'bg-forest-600/20 text-forest-400' :
                                                            record.bowType === 'Compound' ? 'bg-gold-600/20 text-gold-400' :
                                                                'bg-purple-600/20 text-purple-400'
                                                        }`}>
                                                        {record.bowType}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${record.gender === 'M' ? 'bg-blue-600/20 text-blue-400' : 'bg-pink-600/20 text-pink-400'
                                                        }`}>
                                                        {record.gender === 'M' ? 'Men' : 'Women'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-white font-medium">{record.archer}</td>
                                                <td className="py-3 text-right text-gold-400 font-bold">{record.score}</td>
                                                <td className="py-3 text-right text-charcoal-400">{record.year}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Personal Bests */}
                    {activeTab === 'pbs' && (
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                                <svg className="w-6 h-6 text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                                Recent Personal Bests
                            </h2>
                            <div className="grid gap-4">
                                {personalBests.map((pb, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-charcoal-800/50 rounded-lg hover:bg-charcoal-800 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forest-600 to-forest-700 flex items-center justify-center text-white font-bold">
                                                {pb.archer.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{pb.archer}</p>
                                                <p className="text-charcoal-400 text-sm">{pb.round} • {formatDate(pb.date)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gold-400 text-xl font-bold">{pb.score}</p>
                                            <p className="text-forest-400 text-sm font-medium">{pb.improvement}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Archive */}
                    {activeTab === 'archive' && (
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                                <svg className="w-6 h-6 text-charcoal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                                Historical Archive
                            </h2>
                            <div className="grid gap-4">
                                {archiveSeasons.map((season, index) => (
                                    <button
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-charcoal-800/50 rounded-lg hover:bg-charcoal-800 transition-colors text-left group"
                                    >
                                        <div>
                                            <p className="text-white font-medium group-hover:text-forest-400 transition-colors">
                                                {season.season}
                                            </p>
                                            <p className="text-charcoal-400 text-sm">{season.description}</p>
                                        </div>
                                        <svg className="w-5 h-5 text-charcoal-500 group-hover:text-forest-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            </div>
        </div>
    );
};

export default Results;
