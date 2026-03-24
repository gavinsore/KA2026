import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import AdminBreadcrumbs from '../../components/admin/AdminBreadcrumbs';

// Known Kettering Archers club name variants in NCAS data
const KA_CLUB_NAMES = ['kettering', 'kettering archers', 'kettering a'];

const CountyRecordsManager = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null); // { type: 'success'|'error', text: '' }
    const [scrapeStatus, setScrapeStatus] = useState(null); // null | 'running' | 'done' | 'error'
    const [scrapeMessage, setScrapeMessage] = useState('');

    // Inline edit state: rowId -> draft value (null means not editing)
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    // Filter state
    const [bowFilter, setBowFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Collapse state — Sets of keys that are currently EXPANDED (empty = all collapsed)
    const [expandedBowTypes, setExpandedBowTypes] = useState(new Set());
    const [expandedCategories, setExpandedCategories] = useState(new Set());

    const toggleBowType = (bowTypeName) => {
        setExpandedBowTypes(prev => {
            const next = new Set(prev);
            next.has(bowTypeName) ? next.delete(bowTypeName) : next.add(bowTypeName);
            return next;
        });
    };

    const toggleCategory = (key) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const fetchRecords = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('county_records')
                .select('*')
                .order('bow_type', { ascending: true })
                .order('category', { ascending: true })
                .order('round', { ascending: true });
            if (error) throw error;
            setRecords(data || []);
        } catch (err) {
            showMessage('error', 'Failed to load county records: ' + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchRecords(); }, [fetchRecords]);

    // ── Inline Edit ──────────────────────────────────────────────────────────

    const startEdit = (record) => {
        setEditingId(record.id);
        setEditValue(record.round_override ?? '');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    const saveOverride = async (record) => {
        const newVal = editValue.trim() || null;
        try {
            const { error } = await supabase
                .from('county_records')
                .update({ round_override: newVal })
                .eq('id', record.id);
            if (error) throw error;
            setRecords(prev =>
                prev.map(r => r.id === record.id ? { ...r, round_override: newVal } : r)
            );
            showMessage('success', `Round override ${newVal ? `set to "${newVal}"` : 'cleared'} for ${record.bow_type} ${record.category} — ${record.round}.`);
        } catch (err) {
            showMessage('error', 'Failed to save: ' + err.message);
        } finally {
            cancelEdit();
        }
    };

    const clearOverride = async (record) => {
        try {
            const { error } = await supabase
                .from('county_records')
                .update({ round_override: null })
                .eq('id', record.id);
            if (error) throw error;
            setRecords(prev =>
                prev.map(r => r.id === record.id ? { ...r, round_override: null } : r)
            );
            showMessage('success', `Override cleared for "${record.round}".`);
        } catch (err) {
            showMessage('error', 'Failed to clear override: ' + err.message);
        }
    };

    // ── Trigger Rescrape ─────────────────────────────────────────────────────

    const triggerRescrape = async () => {
        setScrapeStatus('running');
        setScrapeMessage('');
        try {
            const { data, error } = await supabase.functions.invoke('scrape-county-records');
            if (error) throw error;
            const result = data || {};
            setScrapeStatus('done');
            setScrapeMessage(
                `Rescrape complete: ${result.upserted ?? '?'} records updated.` +
                (result.errors?.length ? ` ${result.errors.length} error(s): ${result.errors.slice(0, 2).join('; ')}` : '')
            );
            // Reload table to reflect any fresh data
            await fetchRecords();
        } catch (err) {
            setScrapeStatus('error');
            setScrapeMessage('Rescrape failed: ' + (err.message || String(err)));
        }
    };

    // ── Derived data ─────────────────────────────────────────────────────────

    const bowTypes = ['all', ...new Set(records.map(r => r.bow_type))];

    const filtered = records.filter(r => {
        if (bowFilter !== 'all' && r.bow_type !== bowFilter) return false;
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            return (
                (r.round || '').toLowerCase().includes(q) ||
                (r.round_override || '').toLowerCase().includes(q) ||
                (r.archer_name || '').toLowerCase().includes(q) ||
                (r.club || '').toLowerCase().includes(q)
            );
        }
        return true;
    });

    // Group by bow_type → category
    const grouped = filtered.reduce((acc, r) => {
        const bt = r.bow_type || 'Other';
        const cat = r.category || 'All';
        if (!acc[bt]) acc[bt] = {};
        if (!acc[bt][cat]) acc[bt][cat] = [];
        acc[bt][cat].push(r);
        return acc;
    }, {});

    const isKA = (club) => KA_CLUB_NAMES.some(k => (club || '').toLowerCase().includes(k));

    const formatArcherName = (name, club) => {
        if (!name) return '—';
        if (isKA(club)) return name;
        // First-initial + surname convention
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return name;
        return `${parts[0][0]}. ${parts.slice(1).join(' ')}`;
    };

    const overrideCount = records.filter(r => r.round_override).length;

    return (
        <div className="min-h-screen py-10 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AdminBreadcrumbs />

                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-forest-900">County Records Manager</h1>
                        <p className="text-charcoal-600 mt-1 text-sm">
                            Review scraped NCAS records, fix round names, and trigger manual refreshes.
                        </p>
                        {overrideCount > 0 && (
                            <span className="mt-2 inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                {overrideCount} round override{overrideCount !== 1 ? 's' : ''} active
                            </span>
                        )}
                    </div>

                    {/* Rescrape Button */}
                    <button
                        onClick={triggerRescrape}
                        disabled={scrapeStatus === 'running'}
                        className="flex items-center gap-2 px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50 transition-colors shadow-md text-sm font-medium"
                    >
                        {scrapeStatus === 'running' ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        )}
                        {scrapeStatus === 'running' ? 'Scraping…' : 'Trigger Rescrape'}
                    </button>
                </div>

                {/* Scrape status */}
                {scrapeStatus && scrapeStatus !== 'running' && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${scrapeStatus === 'done' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {scrapeMessage}
                        <button onClick={() => setScrapeStatus(null)} className="ml-3 underline text-xs opacity-70 hover:opacity-100">Dismiss</button>
                    </div>
                )}

                {/* Toast message */}
                {message && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                {/* Info box */}
                <div className="mb-5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm flex gap-2">
                    <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <strong>Round Override</strong> — set a corrected round name to match your club record naming convention. The raw NCAS scraped name is preserved and the override survives weekly re-scrapes.
                        Archers from other clubs are shown with initials only (privacy convention) — KA archers show full names.
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-5">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-charcoal-600 font-medium whitespace-nowrap">Bow type:</label>
                        <select
                            value={bowFilter}
                            onChange={e => setBowFilter(e.target.value)}
                            className="text-sm border border-charcoal-200 rounded-md px-2 py-1.5 bg-white focus:ring-forest-500 focus:border-forest-500"
                        >
                            {bowTypes.map(bt => (
                                <option key={bt} value={bt}>{bt === 'all' ? 'All bow types' : bt}</option>
                            ))}
                        </select>
                    </div>
                    <input
                        type="text"
                        placeholder="Search round, archer, or club…"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="flex-1 min-w-[200px] text-sm border border-charcoal-200 rounded-md px-3 py-1.5 bg-white focus:ring-forest-500 focus:border-forest-500"
                    />
                    {(bowFilter !== 'all' || searchQuery) && (
                        <button
                            onClick={() => { setBowFilter('all'); setSearchQuery(''); }}
                            className="text-sm text-charcoal-500 hover:text-forest-700 transition-colors"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Table */}
                {loading ? (
                    <div className="text-center py-16 text-charcoal-500">Loading county records…</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-charcoal-500">No records match your filters.</div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(grouped).map(([bowTypeName, categories]) => {
                            const btExpanded = expandedBowTypes.has(bowTypeName);
                            const totalRecords = Object.values(categories).flat().length;
                            return (
                            <div key={bowTypeName} className="bg-white rounded-xl shadow-sm border border-charcoal-100 overflow-hidden">
                                {/* Bow type header — clickable */}
                                <button
                                    onClick={() => toggleBowType(bowTypeName)}
                                    className="w-full px-4 py-2.5 bg-charcoal-50 border-b border-charcoal-100 flex items-center gap-2 hover:bg-charcoal-100 transition-colors text-left"
                                >
                                    <svg className="w-4 h-4 text-charcoal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    <span className="font-semibold text-charcoal-800">{bowTypeName}</span>
                                    <span className="text-xs text-charcoal-400 ml-auto mr-2">
                                        {totalRecords} records
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-charcoal-400 transition-transform duration-200 shrink-0 ${btExpanded ? '' : '-rotate-90'}`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {btExpanded && Object.entries(categories).map(([catName, catRecords]) => {
                                    const catKey = `${bowTypeName}__${catName}`;
                                    const catExpanded = expandedCategories.has(catKey);
                                    return (
                                    <div key={catName} className="border-b border-charcoal-50 last:border-0">
                                        {/* Category sub-header — clickable */}
                                        <button
                                            onClick={() => toggleCategory(catKey)}
                                            className="w-full px-4 py-1.5 bg-charcoal-50/40 border-b border-charcoal-50 flex items-center gap-2 hover:bg-charcoal-100/50 transition-colors text-left"
                                        >
                                            <span className="text-xs font-semibold text-charcoal-600 uppercase tracking-wide flex-1">{catName}</span>
                                            <span className="text-xs text-charcoal-400 mr-1">{catRecords.length} round{catRecords.length !== 1 ? 's' : ''}</span>
                                            <svg
                                                className={`w-3.5 h-3.5 text-charcoal-400 transition-transform duration-200 shrink-0 ${catExpanded ? '' : '-rotate-90'}`}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {catExpanded && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-left border-b border-charcoal-100 bg-charcoal-50/20">
                                                        <th className="px-4 py-2 text-xs font-medium text-charcoal-600 whitespace-nowrap">Scraped Round</th>
                                                        <th className="px-4 py-2 text-xs font-medium text-charcoal-600 whitespace-nowrap">
                                                            Round Override
                                                            <span className="ml-1 text-charcoal-400 font-normal">(your correction)</span>
                                                        </th>
                                                        <th className="px-4 py-2 text-xs font-medium text-charcoal-600 whitespace-nowrap text-right">Score</th>
                                                        <th className="px-4 py-2 text-xs font-medium text-charcoal-600 whitespace-nowrap">Archer</th>
                                                        <th className="px-4 py-2 text-xs font-medium text-charcoal-600 whitespace-nowrap">Club</th>
                                                        <th className="px-4 py-2 text-xs font-medium text-charcoal-600 whitespace-nowrap">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {catRecords.map(record => (
                                                        <tr
                                                            key={record.id}
                                                            className="border-b border-charcoal-50 last:border-0 hover:bg-charcoal-50/30 transition-colors"
                                                        >
                                                            {/* Scraped round name */}
                                                            <td className="px-4 py-2.5 text-forest-800 font-medium whitespace-nowrap">
                                                                {record.round}
                                                            </td>

                                                            {/* Round override — inline editable */}
                                                            <td className="px-4 py-2.5 min-w-[200px]">
                                                                {editingId === record.id ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            autoFocus
                                                                            type="text"
                                                                            value={editValue}
                                                                            onChange={e => setEditValue(e.target.value)}
                                                                            onKeyDown={e => {
                                                                                if (e.key === 'Enter') saveOverride(record);
                                                                                if (e.key === 'Escape') cancelEdit();
                                                                            }}
                                                                            className="flex-1 text-sm border border-forest-400 rounded px-2 py-1 focus:ring-2 focus:ring-forest-500 outline-none"
                                                                            placeholder="Canonical round name…"
                                                                        />
                                                                        <button
                                                                            onClick={() => saveOverride(record)}
                                                                            className="text-xs px-2 py-1 bg-forest-600 text-white rounded hover:bg-forest-700 transition-colors whitespace-nowrap"
                                                                        >
                                                                            Save
                                                                        </button>
                                                                        <button
                                                                            onClick={cancelEdit}
                                                                            className="text-xs px-2 py-1 bg-charcoal-100 text-charcoal-700 rounded hover:bg-charcoal-200 transition-colors"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2 group">
                                                                        {record.round_override ? (
                                                                            <>
                                                                                <span className="text-purple-700 font-medium">{record.round_override}</span>
                                                                                <button
                                                                                    onClick={() => startEdit(record)}
                                                                                    className="opacity-0 group-hover:opacity-100 text-charcoal-400 hover:text-forest-600 transition-all"
                                                                                    title="Edit override"
                                                                                >
                                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                    </svg>
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => clearOverride(record)}
                                                                                    className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-600 transition-all ml-1"
                                                                                    title="Clear override"
                                                                                >
                                                                                    ✕
                                                                                </button>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <span className="text-charcoal-300 italic text-xs">no override</span>
                                                                                <button
                                                                                    onClick={() => startEdit(record)}
                                                                                    className="opacity-0 group-hover:opacity-100 text-charcoal-400 hover:text-forest-600 transition-all flex items-center gap-1 text-xs"
                                                                                    title="Set override"
                                                                                >
                                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                    </svg>
                                                                                    Set
                                                                                </button>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-2.5 text-right font-semibold text-gold-600 whitespace-nowrap">
                                                                {record.score}
                                                                {record.is_national_record && (
                                                                    <span className="ml-1.5 bg-red-500 text-white text-[9px] uppercase font-bold px-1 py-0.5 rounded">NR</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2.5 text-charcoal-700 whitespace-nowrap">
                                                                {formatArcherName(record.archer_name, record.club)}
                                                                {isKA(record.club) && (
                                                                    <span className="ml-1.5 bg-forest-100 text-forest-700 text-[9px] font-bold px-1 py-0.5 rounded">KA</span>
                                                                )}
                                                            </td>
                                                            <td className="px-4 py-2.5 text-charcoal-500 whitespace-nowrap">{record.club}</td>
                                                            <td className="px-4 py-2.5 text-charcoal-500 whitespace-nowrap">{record.date_text}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        )}
                                    </div>
                                    );
                                })}
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CountyRecordsManager;
