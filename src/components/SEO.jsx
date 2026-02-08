import { useEffect } from 'react';

/**
 * SEO Component - Updates document meta tags for each page
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} [props.canonical] - Canonical URL
 * @param {boolean} [props.noindex] - Prevent search engines from indexing this page
 */
const SEO = ({
    title = 'Kettering Archers',
    description = 'A friendly archery club in Kettering, Northamptonshire. Join us for beginners courses, competitions, and social shooting.',
    canonical,
    noindex = false
}) => {
    useEffect(() => {
        // Update document title
        document.title = title.includes('Kettering Archers') ? title : `${title} | Kettering Archers`;

        // Update meta description
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = description;

        // Update Open Graph tags
        updateMetaTag('og:title', title);
        updateMetaTag('og:description', description);
        updateMetaTag('og:type', 'website');
        updateMetaTag('og:site_name', 'Kettering Archers');

        // Update Twitter Card tags
        updateMetaTag('twitter:card', 'summary');
        updateMetaTag('twitter:title', title);
        updateMetaTag('twitter:description', description);

        // Handle robots meta tag for noindex
        let robotsMeta = document.querySelector('meta[name="robots"]');
        if (noindex) {
            if (!robotsMeta) {
                robotsMeta = document.createElement('meta');
                robotsMeta.name = 'robots';
                document.head.appendChild(robotsMeta);
            }
            robotsMeta.content = 'noindex, nofollow';
        } else if (robotsMeta) {
            robotsMeta.remove();
        }

        // Update canonical link
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonical) {
            if (!canonicalLink) {
                canonicalLink = document.createElement('link');
                canonicalLink.rel = 'canonical';
                document.head.appendChild(canonicalLink);
            }
            canonicalLink.href = canonical;
        } else if (canonicalLink) {
            canonicalLink.remove();
        }

        // Cleanup on unmount - restore defaults
        return () => {
            document.title = 'Kettering Archers';
        };
    }, [title, description, canonical, noindex]);

    return null;
};

/**
 * Helper function to update or create a meta tag
 */
function updateMetaTag(property, content) {
    let meta = document.querySelector(`meta[property="${property}"]`) ||
        document.querySelector(`meta[name="${property}"]`);

    if (!meta) {
        meta = document.createElement('meta');
        if (property.startsWith('og:')) {
            meta.setAttribute('property', property);
        } else {
            meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
    }
    meta.content = content;
}

export default SEO;
