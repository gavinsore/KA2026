import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.4) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(245, 158, 11, 0.3) 0%, transparent 50%)`
                    }} />
                </div>

                {/* Animated Target Rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[800px] h-[800px] rounded-full border-2 border-forest-400/20 animate-pulse" />
                    <div className="absolute w-[600px] h-[600px] rounded-full border-2 border-forest-500/25" />
                    <div className="absolute w-[400px] h-[400px] rounded-full border-2 border-gold-400/20" />
                    <div className="absolute w-[200px] h-[200px] rounded-full border-2 border-gold-500/30" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-fade-in-up">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6">
                            <span className="text-forest-900">Welcome to</span>
                            <br />
                            <span className="gradient-text">Kettering Archers</span>
                        </h1>
                        <p className="text-base sm:text-lg text-charcoal-600 max-w-3xl mx-auto mb-6">
                            A friendly and welcoming archery club in Kettering, Northamptonshire.
                            Whether you're a complete beginner or an experienced archer, we have something for you.
                        </p>
                        <p className="text-base sm:text-lg text-charcoal-600 max-w-3xl mx-auto mb-4">
                            Friday evenings from mid-April to mid-September (summer) we shoot on the field at Kettering Cricket Club.
                        </p>
                        <p className="text-base sm:text-lg text-charcoal-600 max-w-3xl mx-auto mb-4">
                            From mid-September to mid-April (winter) we shoot indoors on Friday evenings from 19.30 to 21.30 at Buccleuch Academy.
                        </p>
                        <p className="text-base sm:text-lg text-charcoal-600 max-w-3xl mx-auto mb-8">
                            Sunday mornings we host a different club competition each week, from clout to target to 3D animals.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/beginners" className="btn-primary text-lg">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Start Your Journey
                            </Link>
                            <Link to="/events" className="btn-secondary text-lg">
                                View Upcoming Events
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
                    <svg className="w-6 h-6 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
                            Why Choose Kettering Archers?
                        </h2>
                        <p className="text-charcoal-600 text-lg max-w-2xl mx-auto">
                            Join our thriving community and discover the joy of archery
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="glass-card p-8 text-center group hover:border-forest-400 hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-lg group-hover:shadow-forest-500/30 transition-shadow animate-float" style={{ animationDelay: '0s' }}>
                                <svg className="w-8 h-8 text-forest-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-forest-900 mb-3">All Welcome</h3>
                            <p className="text-charcoal-600">
                                From complete beginners to experienced competition archers, we welcome everyone regardless of age or ability.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="glass-card p-8 text-center group hover:border-gold-400 hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center shadow-lg group-hover:shadow-gold-500/30 transition-shadow animate-float" style={{ animationDelay: '0.2s' }}>
                                <svg className="w-8 h-8 text-forest-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-forest-900 mb-3">Differing Styles</h3>
                            <p className="text-charcoal-600">
                                Kettering Archers is unique in Northamptonshire as the only club that runs target and clout shoots. We also have archers dedicated to Longbow archery who travel the UK on roves.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="glass-card p-8 text-center group hover:border-forest-400 hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-lg group-hover:shadow-forest-500/30 transition-shadow animate-float" style={{ animationDelay: '0.4s' }}>
                                <svg className="w-8 h-8 text-forest-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-forest-900 mb-3">Equipment Provided</h3>
                            <p className="text-charcoal-600">
                                All equipment is provided for beginners. We have a range of bows suitable for different ages and abilities.
                            </p><br></br>
                            <p className="text-charcoal-600">A small rental fee applies once you have completed your beginner course!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-forest-600 to-forest-800" />
                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-6">
                        Ready to Try Archery?
                    </h2>
                    <p className="text-lg text-forest-100 mb-10">
                        Join our next beginners course and discover the ancient art of archery.
                        No experience necessary – just bring your enthusiasm!
                    </p>
                    <Link to="/beginners" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-forest-900 font-semibold rounded-lg transition-all duration-300 hover:shadow-lg text-lg">
                        Enroll in Beginners Course
                    </Link>
                </div>
            </section>

            {/* Quick Links Section */}
            <section className="py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link to="/events" className="glass-card p-6 group hover:border-forest-400 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center group-hover:bg-forest-600 transition-colors">
                                    <svg className="w-6 h-6 text-forest-600 group-hover:text-forest-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-forest-900 group-hover:text-forest-600 transition-colors">Events</h3>
                                    <p className="text-sm text-charcoal-500">Upcoming shoots & competitions</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/rounds" className="glass-card p-6 group hover:border-gold-400 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center group-hover:bg-gold-500 transition-colors">
                                    <svg className="w-6 h-6 text-gold-600 group-hover:text-forest-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-forest-900 group-hover:text-gold-600 transition-colors">Rounds</h3>
                                    <p className="text-sm text-charcoal-500">Learn about archery rounds</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/results" className="glass-card p-6 group hover:border-forest-400 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center group-hover:bg-forest-600 transition-colors">
                                    <svg className="w-6 h-6 text-forest-600 group-hover:text-forest-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-forest-900 group-hover:text-forest-600 transition-colors">Results</h3>
                                    <p className="text-sm text-charcoal-500">Scores, records & PBs</p>
                                </div>
                            </div>
                        </Link>

                        <Link to="/links" className="glass-card p-6 group hover:border-gold-400 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center group-hover:bg-gold-500 transition-colors">
                                    <svg className="w-6 h-6 text-gold-600 group-hover:text-forest-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-forest-900 group-hover:text-gold-600 transition-colors">Links</h3>
                                    <p className="text-sm text-charcoal-500">Useful archery resources</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
