import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/events', label: 'Events' },
        { path: '/beginners', label: 'Beginners' },
        { path: '/rounds', label: 'Rounds' },
        { path: '/results', label: 'Results' },
        { path: '/links', label: 'Links' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-forest-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src={`${import.meta.env.BASE_URL}logo.jpg`}
                            alt="Kettering Archers Logo"
                            className="w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-md group-hover:shadow-forest-500/30 transition-all duration-300"
                        />
                        <div className="hidden sm:block">
                            <h1 className="text-lg md:text-xl font-bold text-forest-800">Kettering Archers</h1>
                            <p className="text-xs text-forest-600">Archery Club</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isActive(link.path)
                                    ? 'bg-forest-600 text-white shadow-lg shadow-forest-500/30'
                                    : 'text-forest-700 hover:text-forest-900 hover:bg-forest-100'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-forest-700 hover:text-forest-900 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <nav className="md:hidden py-4 border-t border-forest-200">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 ${isActive(link.path)
                                        ? 'bg-forest-600 text-white'
                                        : 'text-forest-700 hover:text-forest-900 hover:bg-forest-100'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
