import { useState, useEffect } from 'react';
import SEO from '../components/SEO';

const Gallery = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load gallery images from JSON file
    useEffect(() => {
        const loadGalleryImages = async () => {
            try {
                const response = await fetch(`${import.meta.env.BASE_URL}data/gallery.json`);
                const data = await response.json();
                // Transform data to include full paths
                const images = data.map((item, index) => ({
                    id: index + 1,
                    src: `${import.meta.env.BASE_URL}gallery/${item.filename}`,
                    alt: item.description || 'Archery at Kettering Archers',
                    description: item.description || ''
                }));
                setGalleryImages(images);
            } catch (error) {
                console.error('Error loading gallery images:', error);
            } finally {
                setLoading(false);
            }
        };

        loadGalleryImages();
    }, []);

    const openLightbox = (image) => {
        setSelectedImage(image);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto';
    };

    const goToNext = () => {
        const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        setSelectedImage(galleryImages[nextIndex]);
    };

    const goToPrev = () => {
        const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
        const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        setSelectedImage(galleryImages[prevIndex]);
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
            <SEO
                title="Photo Gallery | Kettering Archers"
                description="Explore photos from Kettering Archers archery sessions, competitions, and club events. See our facilities and community in action."
            />
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

            {/* Gallery Grid */}
            <section className="py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex justify-center items-center py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-forest-200 border-t-forest-600"></div>
                        </div>
                    ) : galleryImages.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-charcoal-500 text-lg">No gallery images available yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {galleryImages.map((image) => (
                                <div
                                    key={image.id}
                                    className="group"
                                >
                                    <div
                                        className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg cursor-pointer"
                                        onClick={() => openLightbox(image)}
                                    >
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        {/* Zoom icon overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                                <svg className="w-6 h-6 text-forest-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Description below image */}
                                    {image.description && (
                                        <p className="mt-3 text-charcoal-600 text-center text-sm md:text-base">
                                            {image.description}
                                        </p>
                                    )}
                                </div>
                            ))}
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
                        {selectedImage.description && (
                            <p className="text-center text-white/90 mt-4 text-base">
                                {selectedImage.description}
                            </p>
                        )}
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
                    <p className="text-charcoal-600 text-lg">
                        Have photos from our club events or sessions? We'd love to feature them in our gallery!
                        Send your best shots to our club secretary.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Gallery;
