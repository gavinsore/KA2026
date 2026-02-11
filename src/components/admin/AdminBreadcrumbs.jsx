import { Link, useLocation } from 'react-router-dom';

const AdminBreadcrumbs = () => {
    const location = useLocation();
    const path = location.pathname;

    const pathMap = {
        '/admin/events': 'Events & Calendar',
        '/admin/competitions': 'Competitions',
        '/admin/results': 'Results Upload',
        '/admin/announcements': 'Announcements',
        '/admin/links': 'Useful Links',
        '/admin/rounds': 'Archery Rounds'
    };

    // Also handle dynamic sub-paths if necessary, but for now exact match or fallback
    let currentPage = pathMap[path];

    // Simple fallback if navigating deeper (e.g. /admin/competitions/123)
    if (!currentPage) {
        if (path.startsWith('/admin/competitions')) currentPage = 'Competitions';
        else if (path.startsWith('/admin/events')) currentPage = 'Events';
        else currentPage = 'Admin Page';
    }

    if (path === '/admin' || path === '/admin/dashboard') return null;

    return (
        <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
                <li>
                    <div>
                        <Link to="/admin" className="text-gray-400 hover:text-gray-500 transition-colors">
                            <span className="sr-only">Dashboard</span>
                            {/* Home Icon */}
                            <svg className="flex-shrink-0 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </Link>
                    </div>
                </li>
                <li>
                    <div className="flex items-center">
                        <svg className="flex-shrink-0 h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 text-sm font-medium text-gray-500" aria-current="page">{currentPage}</span>
                    </div>
                </li>
            </ol>
        </nav>
    );
};

export default AdminBreadcrumbs;
