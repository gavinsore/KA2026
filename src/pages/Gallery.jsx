import { useState } from 'react';

// Stock archery images from Unsplash for gallery
const galleryImages = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1510925758641-869d353cecc7?w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1510925758641-869d353cecc7?w=600&q=80',
        alt: 'Archery target on a field',
        category: 'Outdoor'
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1565711561500-49678a10a63f?w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1565711561500-49678a10a63f?w=600&q=80',
        alt: 'Outdoor archery range with targets',
        category: 'Outdoor'
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1514125669375-59ee3985d08b?w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1514125669375-59ee3985d08b?w=600&q=80',
        alt: 'Archer aiming at target',
        category: 'Indoor'
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1499744937866-d7e566a20a61?w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1499744937866-d7e566a20a61?w=600&q=80',
        alt: 'Archery competition',
        category: 'Competition'
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&q=80',
        alt: 'Archer drawing bow',
        category: 'Training'
    },
    {
        id: 6,
        src: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80',
        alt: 'Archery equipment close-up',
        category: 'Equipment'
    },
    {
        id: 7,
        src: 'https://images.unsplash.com/photo-1579093571626-53d4e15f8479?w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1579093571626-53d4e15f8479?w=600&q=80',
        alt: 'Target archery session',
        category: 'Training'
    },
    {
        id: 8,
        src: 'https://images.unsplash.com/photo-1594639855377-e33c1f1ee5e7?w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1594639855377-e33c1f1ee5e7?w=600&q=80',
        alt: 'Arrows ready for shooting',
        category: 'Equipment'
    },
    {
        id: 9,
        src: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=80',
        alt: 'Archery in nature',
        category: 'Outdoor'
    },
    {
        id: 10,
        src: 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1577741314755-048d8525d31e?w=600&q=80',
        alt: 'Bow and arrows',
        category: 'Equipment'
    },
    {
        id: 11,
        src: 'https://images.unsplash.com/photo-1592468241978-0a06e6c4f7ff?w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1592468241978-0a06e6c4f7ff?w=600&q=80',
        alt: 'Archer in action',
        category: 'Competition'
    },
    {
        id: 12,
        src: 'https://images.unsplash.com/photo-1584380931214-dbb5b72e7fd0?w=1200&q=80',
        thumb: 'https://images.unsplash.com/photo-1584380931214-dbb5b72e7fd0?w=600&q=80',
        alt: 'Target practice',
        category: 'Training'
    },
];

const categories = ['All', 'Outdoor', 'Indoor', 'Competition', 'Training', 'Equipment'];

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredImages = activeCategory === 'All'
        ? galleryImages
        : galleryImages.filter(img => img.category === activeCategory);

    const openLightbox = (image) => {
        setSelectedImage(image);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    const goToNext = () => {
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        const nextIndex = (currentIndex + 1) % filteredImages.length;
        setSelectedImage(filteredImages[nextIndex]);
    };

    const goToPrev = () => {
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
        setSelectedImage(filteredImages[prevIndex]);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!selectedImage) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'ArrowLeft') goToPrev();
    };

    return (
        <div className="min-h-screen" onKeyDown={handleKeyDown} tabIndex={0}>
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-forest-600 to-forest-800" />
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 30% 30%, rgba(245, 158, 11, 0.4) 0%, transparent 50%)`
                    }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6">
                        Photo Gallery
                    </h1>
                    <p className="text-lg text-forest-100 max-w-3xl mx-auto">
                        Explore moments from our archery sessions, competitions, and club events.
                        Click any image to view it larger.
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-white border-b border-forest-200 sticky top-16 md:top-20 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeCategory === category
                                        ? 'bg-forest-600 text-white shadow-lg shadow-forest-500/30'
                                        : 'bg-forest-50 text-forest-700 hover:bg-forest-100'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filteredImages.map((image) => (
                            <div
                                key={image.id}
                                className="group relative aspect-square overflow-hidden rounded-xl shadow-lg cursor-pointer"
                                onClick={() => openLightbox(image)}
                            >
                                <img
                                    src={image.thumb}
                                    alt={image.alt}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="inline-block px-2 py-1 bg-forest-600/80 text-xs font-medium rounded-md">
                                        {image.category}
                                    </span>
                                </div>
                                {/* Zoom icon overlay */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-forest-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredImages.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-charcoal-500 text-lg">No images found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
                        onClick={closeLightbox}
                        aria-label="Close lightbox"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Previous button */}
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors z-10 bg-black/30 rounded-full hover:bg-black/50"
                        onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                        aria-label="Previous image"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Next button */}
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors z-10 bg-black/30 rounded-full hover:bg-black/50"
                        onClick={(e) => { e.stopPropagation(); goToNext(); }}
                        aria-label="Next image"
                    >
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Image container */}
                    <div
                        className="max-w-[90vw] max-h-[85vh] p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                        />
                        <p className="text-center text-white/80 mt-4 text-sm">
                            {selectedImage.alt} • <span className="text-gold-400">{selectedImage.category}</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Info Section */}
            <section className="py-16 bg-forest-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest-600 text-white mb-6">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-forest-900 mb-4">
                        Share Your Photos
                    </h2>
                    <p className="text-charcoal-600 text-lg mb-6">
                        Have photos from our club events or sessions? We'd love to feature them in our gallery!
                        Send your best shots to our club secretary.
                    </p>
                    <p className="text-charcoal-500 text-sm">
                        <em>Note: These are example images. Club photos will be added as they become available.</em>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Gallery;
