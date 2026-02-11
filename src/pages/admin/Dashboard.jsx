import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';

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
                    <button
                        onClick={handleLogout}
                        className="btn-secondary text-sm px-4 py-2"
                    >
                        Sign Out
                    </button>
                </div>

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
            </div>
        </div>
    );
};

export default Dashboard;
