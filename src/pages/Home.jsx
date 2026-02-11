import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';



const Home = () => {
    const [recentImages, setRecentImages] = useState([]);
    const [loadingGallery, setLoadingGallery] = useState(true);

    useEffect(() => {
        const fetchRecentImages = async () => {
            try {
                const { data, error } = await supabase
                    .from('gallery_images')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(4);

                if (error) throw error;

                if (data && data.length > 0) {
                    const images = data.map((item) => {
                        const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(item.filename);
                        return {
                            id: item.id,
                            src: urlData.publicUrl,
                            alt: item.description || 'Archery at Kettering Archers',
                        };
                    });
                    setRecentImages(images);
                }
            } catch (error) {
                console.error('Error fetching recent gallery images:', error);
            } finally {
                setLoadingGallery(false);
            }
        };

        fetchRecentImages();
    }, []);

    return (
        <div className="min-h-screen">
            <SEO
                title="Kettering Archers - Archery Club in Kettering, Northamptonshire"
                description="A friendly archery club in Kettering. Join us for beginners courses, competitions, and social shooting. Established 1977, all ages welcome from age 7+."
            />
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Hero Background Image */}
                <div className="absolute inset-0">
                    <img
                        src={`${import.meta.env.BASE_URL}gallery/pexels-kampus-6540677.jpg`}
                        alt="Archery at Kettering Archers"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/90" />
                </div>

                {/* Background Pattern Overlay */}
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
                        <p className="text-base sm:text-lg text-charcoal-600 max-w-3xl mx-auto mb-8">
                            A friendly and welcoming archery club in Kettering, Northamptonshire.
                            Whether you're a complete beginner or an experienced archer, we have something for you.
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

            {/* Where We Shoot Section - With Images */}
            <section className="py-20 md:py-32 bg-gradient-to-b from-white to-forest-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
                            Where We Shoot
                        </h2>
                        <p className="text-charcoal-600 text-lg max-w-3xl mx-auto">
                            We shoot year-round in all weathers — rain or shine, our dedicated archers are out on the field.
                            From target archery to clout shooting and field courses, there's always something to aim at.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Outdoor Shooting */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="aspect-[4/3] overflow-hidden">
                                <img
                                    src={`${import.meta.env.BASE_URL}gallery/pexels-kampus-6540679.jpg`}
                                    alt="Outdoor archery"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                                    </svg>
                                    <span className="text-gold-400 font-medium text-sm uppercase tracking-wide">Summer</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Outdoor Shooting</h3>
                                <p className="text-white/90 text-sm">
                                    Friday evenings from mid-April to mid-September at Kettering Cricket Club
                                </p>
                            </div>
                        </div>

                        {/* Indoor Shooting */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="aspect-[4/3] overflow-hidden">
                                <img
                                    src={`${import.meta.env.BASE_URL}gallery/pexels-kampus-6540712.jpg`}
                                    alt="Indoor archery"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                    </svg>
                                    <span className="text-blue-400 font-medium text-sm uppercase tracking-wide">Winter</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Indoor Shooting</h3>
                                <p className="text-white/90 text-sm">
                                    Friday evenings 19:30-21:30 from mid-September to mid-April at Buccleuch Academy
                                </p>
                            </div>
                        </div>

                        {/* Sunday Competitions */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="aspect-[4/3] overflow-hidden">
                                <img
                                    src={`${import.meta.env.BASE_URL}gallery/pexels-kampus-6540714.jpg`}
                                    alt="Archery competition"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <div className="flex items-center gap-2 mb-2">
                                    <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    <span className="text-gold-400 font-medium text-sm uppercase tracking-wide">Weekly</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Sunday Competitions</h3>
                                <p className="text-white/90 text-sm">
                                    Different club competitions each week — clout, target, 3D animals, and more
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
                            About Kettering Archers
                        </h2>
                        <p className="text-charcoal-600 text-lg max-w-3xl mx-auto">
                            A unique archery club with a rich mix of traditional and modern archery
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Longbow Archers */}
                        <div className="glass-card overflow-hidden group hover:border-gold-400 hover:shadow-lg transition-all duration-300">
                            <div className="aspect-[16/9] overflow-hidden">
                                <img
                                    src={`${import.meta.env.BASE_URL}gallery/pexels-kampus-6540679.jpg`}
                                    alt="Traditional longbow archery"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-forest-900 mb-3">The Longbow Lot</h3>
                                <p className="text-charcoal-600">
                                    Our merry band of English Longbow archers are known across the UK for their enthusiasm
                                    for lobbing arrows skyward (occasionally in the direction of a flag), enjoying a good
                                    natter, and embarking on "roves" — essentially walking through woods shooting at things.
                                    What's not to love?
                                </p>
                            </div>
                        </div>

                        {/* Target & Clout Archers */}
                        <div className="glass-card overflow-hidden group hover:border-forest-400 hover:shadow-lg transition-all duration-300">
                            <div className="aspect-[16/9] overflow-hidden">
                                <img
                                    src={`${import.meta.env.BASE_URL}gallery/pexels-kampus-6540714.jpg`}
                                    alt="Target archery"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-forest-900 mb-3">Target & Clout Crew</h3>
                                <p className="text-charcoal-600">
                                    Then there's the rest of us — happily switching between aiming at proper target faces
                                    and launching arrows into the distance at clout. Recurve, compound, barebow... we've got
                                    the lot. Some even compete at county and national level (show-offs).
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Unique in Northamptonshire */}
                        <div className="glass-card p-8 text-center group hover:border-gold-400 hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center shadow-lg group-hover:shadow-gold-500/30 transition-shadow animate-float" style={{ animationDelay: '0s' }}>
                                <svg className="w-8 h-8 text-forest-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-forest-900 mb-3">Unique in Northamptonshire</h3>
                            <p className="text-charcoal-600">
                                We're the only club in the county offering both target and clout shooting — plus our own licensed clubhouse for after the action!
                            </p>
                        </div>

                        {/* All Welcome */}
                        <div className="glass-card p-8 text-center group hover:border-forest-400 hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-lg group-hover:shadow-forest-500/30 transition-shadow animate-float" style={{ animationDelay: '0.2s' }}>
                                <svg className="w-8 h-8 text-forest-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-forest-900 mb-3">All Ages & Abilities</h3>
                            <p className="text-charcoal-600">
                                We welcome everyone from age 7 upwards, complete beginners to seasoned competition archers. There's always someone on hand to help.
                            </p>
                        </div>

                        {/* Friendly Advice */}
                        <div className="glass-card p-8 text-center group hover:border-gold-400 hover:shadow-lg transition-all duration-300">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center shadow-lg group-hover:shadow-gold-500/30 transition-shadow animate-float" style={{ animationDelay: '0.4s' }}>
                                <svg className="w-8 h-8 text-forest-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-forest-900 mb-3">Friendly Advice</h3>
                            <p className="text-charcoal-600">
                                With lots of experienced archers on hand, you'll always find people happy to offer advice on technique, equipment, and getting the most from your shooting.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Enhanced */}
            <section className="py-12 md:py-16 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-forest-600 via-forest-700 to-forest-800" />

                {/* Animated Target Rings Pattern */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="absolute w-[600px] h-[600px] rounded-full border-2 border-white/30 animate-pulse" />
                    <div className="absolute w-[450px] h-[450px] rounded-full border-2 border-white/25" style={{ animationDelay: '0.5s' }} />
                    <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-gold-400/40" />
                    <div className="absolute w-[150px] h-[150px] rounded-full border-2 border-gold-400/50" />
                    <div className="absolute w-[50px] h-[50px] rounded-full bg-gold-400/30" />
                </div>

                {/* Decorative arrows */}
                <div className="absolute top-10 left-10 opacity-10 rotate-45">
                    <svg className="w-32 h-32 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div className="absolute bottom-10 right-10 opacity-10 -rotate-45">
                    <svg className="w-24 h-24 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Glass card container */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
                        <div className="text-center mb-6">
                            {/* Icon */}
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold-500/20 border-2 border-gold-400/50 mb-4 animate-float">
                                <svg className="w-7 h-7 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>

                            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">
                                Ready to Try Archery?
                            </h2>
                            <p className="text-base md:text-lg text-forest-100 max-w-2xl mx-auto">
                                Join our next beginners course and discover the ancient art of archery.
                                No experience necessary – just bring your enthusiasm!
                            </p>
                        </div>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6">
                            <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-xl md:text-3xl font-bold text-gold-400 mb-1">75+</div>
                                <div className="text-xs md:text-sm text-forest-100 uppercase tracking-wide">Members</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-xl md:text-3xl font-bold text-gold-400 mb-1">1977</div>
                                <div className="text-xs md:text-sm text-forest-100 uppercase tracking-wide">Established</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                                <div className="text-xl md:text-3xl font-bold text-gold-400 mb-1">Age 7+</div>
                                <div className="text-xs md:text-sm text-forest-100 uppercase tracking-wide">Welcome</div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="text-center">
                            <Link
                                to="/beginners"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gold-500 hover:bg-gold-400 text-forest-900 font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 text-lg group"
                            >
                                <span>Enroll in Beginners Course</span>
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Preview Section */}
            <section className="py-20 md:py-32 bg-gradient-to-b from-forest-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-forest-900 mb-4">
                            Life at Kettering Archers
                        </h2>
                        <p className="text-charcoal-600 text-lg max-w-2xl mx-auto">
                            A glimpse of what it's like to be part of our archery community
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {loadingGallery ? (
                            <div className="col-span-full py-12 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-4 border-forest-200 border-t-forest-600"></div>
                            </div>
                        ) : recentImages.length > 0 ? (
                            recentImages.map((img) => (
                                <div key={img.id} className="aspect-square overflow-hidden rounded-xl shadow-lg group">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            ))
                        ) : (
                            // Fallback static images if no dynamic ones found
                            <>
                                <div className="aspect-square overflow-hidden rounded-xl shadow-lg group">
                                    <img
                                        src={`${import.meta.env.BASE_URL}gallery/pexels-kampus-6540677.jpg`}
                                        alt="Archery at Kettering Archers"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="aspect-square overflow-hidden rounded-xl shadow-lg group">
                                    <img
                                        src={`${import.meta.env.BASE_URL}gallery/pexels-kampus-6540679.jpg`}
                                        alt="Archery at Kettering Archers"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="aspect-square overflow-hidden rounded-xl shadow-lg group">
                                    <img
                                        src={`${import.meta.env.BASE_URL}gallery/pexels-kampus-6540712.jpg`}
                                        alt="Archery at Kettering Archers"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="aspect-square overflow-hidden rounded-xl shadow-lg group">
                                    <img
                                        src={`${import.meta.env.BASE_URL}gallery/pexels-kampus-6540714.jpg`}
                                        alt="Archery at Kettering Archers"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="text-center">
                        <Link
                            to="/gallery"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-forest-600 hover:bg-forest-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            View Full Gallery
                        </Link>
                    </div>
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
