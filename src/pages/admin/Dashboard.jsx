import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';
import { supabase } from '../../lib/supabase';

// ─── Site Analytics Panel ────────────────────────────────────────────────────

function SiteAnalytics() {
    const [dailyData, setDailyData]     = useState([]);   // { date, count }[]
    const [topPages, setTopPages]       = useState([]);   // { page, count }[]
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError(null);
            try {
                // Format a Date as YYYY-MM-DD in the browser's LOCAL timezone.
                // Using toISOString() would give UTC, which is 1 hour behind BST
                // and causes today's visits to fall outside the dayMap.
                const toLocalDateStr = (d) => {
                    const y = d.getFullYear();
                    const m = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${y}-${m}-${day}`;
                };

                // Start of the 30-day window at local midnight
                const since = new Date();
                since.setDate(since.getDate() - 29);
                since.setHours(0, 0, 0, 0);

                const { data, error: dbErr } = await supabase
                    .from('page_visits')
                    .select('visited_at, page, session_id, daily_hash')
                    .gte('visited_at', since.toISOString())
                    .order('visited_at', { ascending: true });

                if (dbErr) throw dbErr;

                // Build dayMap keys using LOCAL dates so today is always included
                const dayMap = {};
                const sessionMap = {}; // date → Set of unique session IDs
                const pageMap = {};
                for (let i = 0; i < 30; i++) {
                    const d = new Date(since);
                    d.setDate(d.getDate() + i);
                    const key = toLocalDateStr(d);
                    dayMap[key] = 0;
                    sessionMap[key] = new Set();
                }

                // visited_at arrives as a UTC ISO string — convert to local date
                (data || []).forEach(({ visited_at, page, session_id, daily_hash }) => {
                    const day = toLocalDateStr(new Date(visited_at));
                    if (day in dayMap) {
                        dayMap[day]++;
                        // Prefer daily_hash (IP-based, accurate across tabs/days)
                        // Fall back to session_id if hash not yet populated
                        const uniqueKey = daily_hash ?? session_id;
                        if (uniqueKey) sessionMap[day].add(uniqueKey);
                    }
                    pageMap[page] = (pageMap[page] || 0) + 1;
                });

                setDailyData(
                    Object.entries(dayMap).map(([date, count]) => ({
                        date,
                        count,
                        sessions: sessionMap[date]?.size ?? 0,
                    }))
                );
                setTopPages(
                    Object.entries(pageMap)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 8)
                        .map(([page, count]) => ({ page, count }))
                );
            } catch (e) {
                console.error('[SiteAnalytics]', e);
                setError('Could not load analytics data.');
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Derived stats — use local date strings to match the dayMap keys
    const toLocalDateStr = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    };
    const totalMonth        = dailyData.reduce((s, d) => s + d.count, 0);
    const totalMonthSess    = dailyData.reduce((s, d) => s + d.sessions, 0);
    const today             = toLocalDateStr(new Date());
    const todayEntry        = dailyData.find(d => d.date === today);
    const todayCount        = todayEntry?.count    ?? 0;
    const todaySessions     = todayEntry?.sessions ?? 0;
    const weekStart         = new Date(); weekStart.setDate(weekStart.getDate() - 6);
    const weekStr           = toLocalDateStr(weekStart);
    const weekData          = dailyData.filter(d => d.date >= weekStr);
    const weekCount         = weekData.reduce((s, d) => s + d.count, 0);
    const weekSessions      = weekData.reduce((s, d) => s + d.sessions, 0);
    const maxCount          = Math.max(...dailyData.map(d => d.count), 1);

    const fmtDate = (iso) => {
        const d = new Date(iso + 'T00:00:00');
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    const pageName = (path) => path === '/' ? 'Home' : path.replace(/^\//, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

    return (
        <div className="mt-10 pt-10 border-t border-forest-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-forest-50 rounded-lg border border-forest-200">
                    <svg className="w-5 h-5 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-forest-900">Site Analytics</h2>
                    <p className="text-xs text-charcoal-400 mt-0.5">Cookie-free · Last 30 days · Public pages only</p>
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center h-40 text-charcoal-400">
                    <svg className="animate-spin w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Loading analytics…
                </div>
            )}

            {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            {!loading && !error && (
                <>
                    {/* ── Stat Cards ─────────────────────────────────────── */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Today',      views: todayCount,  sessions: todaySessions,  icon: '📅', color: 'from-forest-500 to-forest-600' },
                            { label: 'This Week',  views: weekCount,   sessions: weekSessions,   icon: '📆', color: 'from-teal-500 to-teal-600'   },
                            { label: 'This Month', views: totalMonth,  sessions: totalMonthSess, icon: '📊', color: 'from-gold-500 to-gold-600'   },
                        ].map(({ label, views, sessions, icon, color }) => (
                            <div key={label} className="glass-card p-5 flex flex-col gap-1">
                                <span className="text-2xl">{icon}</span>
                                <span className={`text-3xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>
                                    {views.toLocaleString()}
                                </span>
                                <span className="text-xs text-charcoal-400 font-medium uppercase tracking-wide">{label}</span>
                                <div className="mt-1 pt-1 border-t border-charcoal-100 flex items-center gap-1">
                                    <svg className="w-3 h-3 text-charcoal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-xs text-charcoal-500">
                                        <strong>{sessions.toLocaleString()}</strong> unique visitor{sessions !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Bar Chart ──────────────────────────────────────── */}
                    <div className="glass-card p-6 mb-6">
                        <h3 className="text-sm font-semibold text-charcoal-500 uppercase tracking-wide mb-4">
                            Daily Visits — Last 30 Days
                        </h3>
                        {totalMonth === 0 ? (
                            <p className="text-center text-charcoal-400 text-sm py-8">No visits recorded yet.</p>
                        ) : (
                            <div className="flex items-end gap-1 h-32" aria-label="Daily visits bar chart">
                                {dailyData.map(({ date, count }) => {
                                    const heightPct = Math.max((count / maxCount) * 100, count > 0 ? 4 : 0);
                                    const isToday   = date === today;
                                    return (
                                        <div
                                            key={date}
                                            className="flex-1 flex flex-col items-center justify-end gap-0.5 group relative"
                                            title={`${fmtDate(date)}: ${count} visit${count !== 1 ? 's' : ''}`}
                                        >
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                                                <div className="bg-charcoal-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                                                    {fmtDate(date)}: <strong>{count}</strong>
                                                </div>
                                                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-charcoal-800" />
                                            </div>
                                            {/* Bar */}
                                            <div
                                                style={{ height: `${heightPct}%` }}
                                                className={`w-full rounded-t transition-all duration-300 ${
                                                    isToday
                                                        ? 'bg-gradient-to-t from-gold-500 to-gold-400'
                                                        : 'bg-gradient-to-t from-forest-500 to-forest-400 group-hover:from-forest-600 group-hover:to-forest-500'
                                                }`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        {/* X-axis labels — show only a few to avoid crowding */}
                        <div className="flex justify-between mt-2 text-xs text-charcoal-400">
                            {[0, 7, 14, 21, 29].map(i => (
                                <span key={i}>{dailyData[i] ? fmtDate(dailyData[i].date) : ''}</span>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-charcoal-400">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-forest-500 to-forest-400 inline-block" /> Past days
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-sm bg-gradient-to-t from-gold-500 to-gold-400 inline-block" /> Today
                            </span>
                        </div>
                    </div>

                    {/* ── Top Pages ──────────────────────────────────────── */}
                    {topPages.length > 0 && (
                        <div className="glass-card p-6">
                            <h3 className="text-sm font-semibold text-charcoal-500 uppercase tracking-wide mb-4">
                                Top Pages — Last 30 Days
                            </h3>
                            <div className="space-y-2">
                                {topPages.map(({ page, count }, idx) => {
                                    const barPct = Math.round((count / topPages[0].count) * 100);
                                    return (
                                        <div key={page} className="flex items-center gap-3">
                                            <span className="text-xs text-charcoal-400 w-4 text-right shrink-0">{idx + 1}</span>
                                            <span className="text-sm font-medium text-charcoal-700 w-28 shrink-0 truncate" title={page}>
                                                {pageName(page)}
                                            </span>
                                            <div className="flex-1 bg-charcoal-100 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-forest-400 to-forest-600 rounded-full transition-all duration-500"
                                                    style={{ width: `${barPct}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-semibold text-charcoal-600 w-10 text-right shrink-0">
                                                {count.toLocaleString()}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const modules = [
        {
            title: 'Events & Calendar',
            description: 'Manage upcoming club shoots, beginners courses, and social events.',
            icon: (
                <svg className="w-8 h-8 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            link: '/admin/events',
            color: 'bg-forest-50 border-forest-200'
        },
        {
            title: 'Beginners Course',
            description: 'Update the adult and junior fees shown on the beginners enrollment page.',
            icon: (
                <svg className="w-8 h-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            link: '/admin/beginners-course',
            color: 'bg-teal-50 border-teal-200'
        },
        {
            title: 'Competitions',
            description: 'Create and edit open competitions and download entry lists.',
            icon: (
                <svg className="w-8 h-8 text-gold-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            ),
            link: '/admin/competitions',
            color: 'bg-gold-50 border-gold-200'
        },
        {
            title: 'Results Upload',
            description: 'Upload PDF/CSV results files and manage the results archive.',
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            link: '/admin/results',
            color: 'bg-blue-50 border-blue-200'
        },
        {
            title: 'Announcements',
            description: 'Post club news, updates, and important notices.',
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
            ),
            link: '/admin/announcements',
            color: 'bg-orange-50 border-orange-200'
        },
        {
            title: 'Useful Links',
            description: 'Manage the collection of external archery resources.',
            icon: (
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
            ),
            link: '/admin/links',
            color: 'bg-green-100 text-green-800'
        },
        {
            title: 'Gallery Manager',
            icon: (
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            description: 'Upload and manage photo gallery.',
            link: '/admin/gallery',
            color: 'bg-purple-100 text-purple-800'
        },
        {
            title: 'County Records',
            description: 'Review and correct scraped NCAS county records. Fix round name mismatches and trigger manual data refreshes.',
            icon: (
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
            ),
            link: '/admin/county-records',
            color: 'bg-purple-50 border-purple-200'
        },
        {
            title: 'Archery Rounds',
            description: 'Update round details, scoring, and handicaps.',
            icon: (
                <svg className="w-8 h-8 text-charcoal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            link: '/admin/rounds',
            color: 'bg-charcoal-50 border-charcoal-200'
        }
    ];

    return (
        <div className="min-h-screen py-10 md:py-16">
            <SEO title="Admin Dashboard | Kettering Archers" description="Admin management dashboard." />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-forest-900">Admin Dashboard</h1>
                        <p className="text-charcoal-600 mt-1">
                            Welcome back, <span className="font-semibold">{user?.email}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            to="/admin/update-password"
                            className="btn-secondary text-sm px-4 py-2"
                        >
                            Update Password
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="btn-secondary text-sm px-4 py-2"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Module cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module) => (
                        <Link
                            key={module.title}
                            to={module.link}
                            className={`block p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${module.color}`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-white rounded-lg shadow-sm">
                                    {module.icon}
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-forest-900 mb-2">{module.title}</h2>
                            <p className="text-charcoal-600 text-sm leading-relaxed">
                                {module.description}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* Analytics panel — below the module grid */}
                <SiteAnalytics />
            </div>
        </div>
    );
};

export default Dashboard;
