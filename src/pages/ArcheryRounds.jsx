import { useState } from 'react';
import RoundCard from '../components/RoundCard';
import SEO from '../components/SEO';

const ArcheryRounds = () => {
    const [activeFilter, setActiveFilter] = useState('all');

    // Categories for filtering
    const categories = [
        { id: 'all', label: 'All Rounds', color: 'bg-charcoal-100 text-charcoal-700 border-charcoal-300' },
        { id: 'indoor', label: 'Indoor', color: 'bg-blue-100 text-blue-700 border-blue-300' },
        { id: 'outdoor', label: 'Outdoor', color: 'bg-forest-100 text-forest-700 border-forest-300' },
        { id: 'clout', label: 'Clout', color: 'bg-purple-100 text-purple-700 border-purple-300' },
        { id: 'field', label: 'Field', color: 'bg-amber-100 text-amber-700 border-amber-300' },
        { id: 'fun', label: 'Fun / Novelty', color: 'bg-pink-100 text-pink-700 border-pink-300' },
    ];

    // All rounds with category and official/custom flag
    const rounds = [
        // Indoor Imperial
        {
            name: "Portsmouth",
            category: "indoor", measurement: "imperial",
            isOfficial: true,
            description: "Indoor round shot at 20 yards on a 60cm face. Popular competition round.",
            distanceBreakdown: [
                { distance: "20 yards", arrows: 60 }
            ],
            maxScore: "600"
        },
        {
            name: "Worcester",
            category: "indoor", measurement: "imperial",
            isOfficial: true,
            description: "Indoor round shot at 20 yards on a 16-inch black and white face.",
            distanceBreakdown: [
                { distance: "20 yards", arrows: 60 }
            ],
            maxScore: "300"
        },
        {
            name: "Vegas",
            category: "indoor", measurement: "imperial",
            isOfficial: true,
            description: "Popular American indoor format, shot on a 40cm triple face.",
            distanceBreakdown: [
                { distance: "20 yards", arrows: 30 }
            ],
            maxScore: "300"
        },

        // Indoor Metric
        {
            name: "WA 18",
            category: "indoor", measurement: "metric",
            isOfficial: true,
            description: "World Archery indoor round. Shot on a 40cm triple vertical face.",
            distanceBreakdown: [
                { distance: "18 metres", arrows: 60 }
            ],
            maxScore: "600"
        },
        {
            name: "WA 25",
            category: "indoor", measurement: "metric",
            isOfficial: true,
            description: "World Archery indoor round at longer distance. Shot on a 60cm face.",
            distanceBreakdown: [
                { distance: "25 metres", arrows: 60 }
            ],
            maxScore: "600"
        },
        {
            name: "Bray I",
            category: "indoor", measurement: "metric",
            isOfficial: true,
            description: "Short indoor metric round, often used for practice or junior competitions.",
            distanceBreakdown: [
                { distance: "20 metres", arrows: 30 }
            ],
            maxScore: "300"
        },
        {
            name: "Bray II",
            category: "indoor", measurement: "metric",
            isOfficial: true,
            description: "Slightly shorter version of the Bray round.",
            distanceBreakdown: [
                { distance: "25 metres", arrows: 30 }
            ],
            maxScore: "300"
        },

        // Outdoor Imperial
        {
            name: "York",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "The longest and most prestigious imperial round for men.",
            distanceBreakdown: [
                { distance: "100 yards", arrows: 72 },
                { distance: "80 yards", arrows: 48 },
                { distance: "60 yards", arrows: 24 }
            ],
            maxScore: "1296"
        },
        {
            name: "Hereford",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "Standard long-distance round for women, equivalent distances to Bristol I.",
            distanceBreakdown: [
                { distance: "80 yards", arrows: 72 },
                { distance: "60 yards", arrows: 48 },
                { distance: "50 yards", arrows: 24 }
            ],
            maxScore: "1296"
        },
        {
            name: "Bristol I",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "Long-distance round primarily for U18 boys.",
            distanceBreakdown: [
                { distance: "80 yards", arrows: 72 },
                { distance: "60 yards", arrows: 48 },
                { distance: "50 yards", arrows: 24 }
            ],
            maxScore: "1296"
        },
        {
            name: "Bristol II",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "Medium-distance round for U16 boys and U18 girls.",
            distanceBreakdown: [
                { distance: "60 yards", arrows: 72 },
                { distance: "50 yards", arrows: 48 },
                { distance: "40 yards", arrows: 24 }
            ],
            maxScore: "1296"
        },
        {
            name: "Bristol III",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "Shorter round for U14 boys and U16 girls.",
            distanceBreakdown: [
                { distance: "50 yards", arrows: 72 },
                { distance: "40 yards", arrows: 48 },
                { distance: "30 yards", arrows: 24 }
            ],
            maxScore: "1296"
        },
        {
            name: "Bristol IV",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "Junior round for U12 boys and U14 girls.",
            distanceBreakdown: [
                { distance: "40 yards", arrows: 72 },
                { distance: "30 yards", arrows: 48 },
                { distance: "20 yards", arrows: 24 }
            ],
            maxScore: "1296"
        },
        {
            name: "Bristol V",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "Shortest Bristol round for youngest juniors.",
            distanceBreakdown: [
                { distance: "30 yards", arrows: 72 },
                { distance: "20 yards", arrows: 48 },
                { distance: "10 yards", arrows: 24 }
            ],
            maxScore: "1296"
        },
        {
            name: "National",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "Traditional British outdoor round. Popular for club competitions.",
            distanceBreakdown: [
                { distance: "60 yards", arrows: 48 },
                { distance: "50 yards", arrows: 24 }
            ],
            maxScore: "864"
        },
        {
            name: "Western",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "Shorter outdoor round suitable for all abilities.",
            distanceBreakdown: [
                { distance: "60 yards", arrows: 48 },
                { distance: "50 yards", arrows: 48 }
            ],
            maxScore: "864"
        },
        {
            name: "Windsor",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "Traditional outdoor round at medium distances.",
            distanceBreakdown: [
                { distance: "60 yards", arrows: 36 },
                { distance: "50 yards", arrows: 36 },
                { distance: "40 yards", arrows: 36 }
            ],
            maxScore: "972"
        },
        {
            name: "American",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "Popular outdoor round shot at medium-long distances.",
            distanceBreakdown: [
                { distance: "60 yards", arrows: 30 },
                { distance: "50 yards", arrows: 30 },
                { distance: "40 yards", arrows: 30 }
            ],
            maxScore: "810"
        },
        {
            name: "St George",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "Prestigious long-distance imperial round.",
            distanceBreakdown: [
                { distance: "100 yards", arrows: 36 },
                { distance: "80 yards", arrows: 36 },
                { distance: "60 yards", arrows: 36 }
            ],
            maxScore: "972"
        },
        {
            name: "Albion",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "Medium-distance imperial round suitable for most archers.",
            distanceBreakdown: [
                { distance: "80 yards", arrows: 36 },
                { distance: "60 yards", arrows: 36 },
                { distance: "50 yards", arrows: 36 }
            ],
            maxScore: "972"
        },

        // Outdoor Metric
        {
            name: "WA 1440 (Gents)",
            category: "outdoor", measurement: "metric",
            isOfficial: true,
            description: "World Archery outdoor round for men. Shot at 4 distances on 122cm and 80cm faces.",
            distanceBreakdown: [
                { distance: "90 metres", arrows: 36 },
                { distance: "70 metres", arrows: 36 },
                { distance: "50 metres", arrows: 36 },
                { distance: "30 metres", arrows: 36 }
            ],
            maxScore: "1440"
        },
        {
            name: "WA 1440 (Ladies)",
            category: "outdoor", measurement: "metric",
            isOfficial: true,
            description: "World Archery outdoor round for women. Shot at 4 distances on 122cm and 80cm faces.",
            distanceBreakdown: [
                { distance: "70 metres", arrows: 36 },
                { distance: "60 metres", arrows: 36 },
                { distance: "50 metres", arrows: 36 },
                { distance: "30 metres", arrows: 36 }
            ],
            maxScore: "1440"
        },
        {
            name: "WA 720",
            category: "outdoor", measurement: "metric",
            isOfficial: true,
            description: "Half of a WA 1440, shot at single distance. Common competition format.",
            distanceBreakdown: [
                { distance: "70m or 50m", arrows: 72 }
            ],
            maxScore: "720"
        },
        {
            name: "WA 70",
            category: "outdoor", measurement: "metric",
            isOfficial: true,
            description: "Standard Olympic distance round. Shot on a 122cm face.",
            distanceBreakdown: [
                { distance: "70 metres", arrows: 72 }
            ],
            maxScore: "720"
        },
        {
            name: "WA 60",
            category: "outdoor", measurement: "metric",
            isOfficial: true,
            description: "Intermediate distance metric round.",
            distanceBreakdown: [
                { distance: "60 metres", arrows: 72 }
            ],
            maxScore: "720"
        },
        {
            name: "WA 50",
            category: "outdoor", measurement: "metric",
            isOfficial: true,
            description: "Compound bow standard distance. Shot on an 80cm face.",
            distanceBreakdown: [
                { distance: "50 metres", arrows: 72 }
            ],
            maxScore: "720"
        },
        {
            name: "Metric 122-50",
            category: "outdoor", measurement: "metric",
            isOfficial: true,
            description: "Junior/beginner metric round at shorter distances.",
            distanceBreakdown: [
                { distance: "50 metres", arrows: 36 },
                { distance: "40 metres", arrows: 36 },
                { distance: "30 metres", arrows: 36 }
            ],
            maxScore: "1080"
        },
        {
            name: "Short Metric",
            category: "outdoor", measurement: "metric",
            isOfficial: true,
            description: "Compact metric round for beginners or shorter sessions.",
            distanceBreakdown: [
                { distance: "50 metres", arrows: 36 },
                { distance: "30 metres", arrows: 36 }
            ],
            maxScore: "720"
        },
        {
            name: "Long Metric (Gents)",
            category: "outdoor", measurement: "metric",
            isOfficial: true,
            description: "Two-distance metric round for men.",
            distanceBreakdown: [
                { distance: "90 metres", arrows: 36 },
                { distance: "70 metres", arrows: 36 }
            ],
            maxScore: "720"
        },
        {
            name: "Long Metric (Ladies)",
            category: "outdoor", measurement: "metric",
            isOfficial: true,
            description: "Two-distance metric round for women.",
            distanceBreakdown: [
                { distance: "70 metres", arrows: 36 },
                { distance: "60 metres", arrows: 36 }
            ],
            maxScore: "720"
        },

        // Clout Imperial
        {
            name: "Clout Imperial (Gents)",
            category: "clout", measurement: "imperial",
            isOfficial: true,
            description: "Long distance shooting at a flag (clout) on the ground. Arrows scored by proximity to flag.",
            distanceBreakdown: [
                { distance: "180 yards", arrows: 36 }
            ],
            maxScore: "180"
        },
        {
            name: "Clout Imperial (Ladies)",
            category: "clout", measurement: "imperial",
            isOfficial: true,
            description: "Long distance shooting at a flag (clout) on the ground for women.",
            distanceBreakdown: [
                { distance: "140 yards", arrows: 36 }
            ],
            maxScore: "180"
        },
        {
            name: "Double Clout Imperial (Gents)",
            category: "clout", measurement: "imperial",
            isOfficial: true,
            description: "Two rounds of clout shooting for a longer competition.",
            distanceBreakdown: [
                { distance: "180 yards", arrows: 72 }
            ],
            maxScore: "360"
        },
        {
            name: "Double Clout Imperial (Ladies)",
            category: "clout", measurement: "imperial",
            isOfficial: true,
            description: "Two rounds of clout shooting for a longer competition for women.",
            distanceBreakdown: [
                { distance: "140 yards", arrows: 72 }
            ],
            maxScore: "360"
        },

        // Clout Metric
        {
            name: "WA Clout (Gents)",
            category: "clout", measurement: "metric",
            isOfficial: true,
            description: "World Archery clout format using metric distances for men.",
            distanceBreakdown: [
                { distance: "165 metres", arrows: 36 }
            ],
            maxScore: "180"
        },
        {
            name: "WA Clout (Ladies)",
            category: "clout", measurement: "metric",
            isOfficial: true,
            description: "World Archery clout format using metric distances for women.",
            distanceBreakdown: [
                { distance: "125 metres", arrows: 36 }
            ],
            maxScore: "180"
        },
        {
            name: "Double WA Clout (Gents)",
            category: "clout", measurement: "metric",
            isOfficial: true,
            description: "Two rounds of WA clout for longer competitions for men.",
            distanceBreakdown: [
                { distance: "165 metres", arrows: 72 }
            ],
            maxScore: "360"
        },
        {
            name: "Double WA Clout (Ladies)",
            category: "clout", measurement: "metric",
            isOfficial: true,
            description: "Two rounds of WA clout for longer competitions for women.",
            distanceBreakdown: [
                { distance: "125 metres", arrows: 72 }
            ],
            maxScore: "360"
        },

        // Official Indoor Rounds from KA shoots
        {
            name: "Frostbite",
            category: "outdoor", measurement: "metric",
            isOfficial: true,
            description: "Popular winter league round. Shot on an 80cm face with metric scoring.",
            distanceBreakdown: [
                { distance: "30 metres", arrows: 36 }
            ],
            maxScore: "360"
        },
        {
            name: "Stafford",
            category: "indoor", measurement: "imperial",
            isOfficial: true,
            description: "Indoor round shot on an 80cm face. Popular club competition round.",
            distanceBreakdown: [
                { distance: "30 yards", arrows: 72 }
            ],
            maxScore: "720"
        },
        {
            name: "Oxford",
            category: "indoor", measurement: "imperial",
            isOfficial: true,
            description: "Indoor round shot at 20 yards on a 60cm standard face.",
            distanceBreakdown: [
                { distance: "20 yards", arrows: 36 }
            ],
            maxScore: "360"
        },
        {
            name: "London",
            category: "indoor", measurement: "imperial",
            isOfficial: true,
            description: "Indoor round shot at 25 yards on an 80cm standard face.",
            distanceBreakdown: [
                { distance: "25 yards", arrows: 36 }
            ],
            maxScore: "360"
        },
        {
            name: "Cambridge",
            category: "indoor", measurement: "imperial",
            isOfficial: true,
            description: "Indoor round shot at 20 yards on a 60cm half face.",
            distanceBreakdown: [
                { distance: "20 yards", arrows: 36 }
            ],
            maxScore: "360"
        },
        {
            name: "Coventry",
            category: "indoor", measurement: "imperial",
            isOfficial: true,
            description: "Indoor round shot at 20 yards on a 40cm 3-spot vertical face. 5-zone scoring.",
            distanceBreakdown: [
                { distance: "20 yards", arrows: 36 }
            ],
            maxScore: "180"
        },
        {
            name: "Stratford",
            category: "indoor", measurement: "imperial",
            isOfficial: true,
            description: "Indoor round shot at 20 yards on two Worcester faces arranged vertically.",
            distanceBreakdown: [
                { distance: "20 yards", arrows: 48 }
            ],
            maxScore: "240"
        },

        // Field Archery Rounds
        {
            name: "Field",
            category: "field",
            isOfficial: false,
            description: "KA field round with 8 different distances from 10-80 yards in various directions.",
            distanceBreakdown: [
                { distance: "10-80 yards", arrows: 48 }
            ],
            maxScore: "480"
        },
        {
            name: "Pope-Young",
            category: "field",
            isOfficial: false,
            description: "Speed shoot at various target faces from 15-25 paces. 2 x 3 dozen arrows.",
            distanceBreakdown: [
                { distance: "15-25 paces", arrows: 72 }
            ],
            maxScore: "720"
        },
        {
            name: "Royal Game",
            category: "field",
            isOfficial: false,
            description: "Shot at 9 different 3D animals plus a King/Knight target from 10-70 paces.",
            distanceBreakdown: [
                { distance: "10-70 paces", arrows: 60 }
            ],
            maxScore: "600"
        },
        {
            name: "Safari",
            category: "field",
            isOfficial: false,
            description: "Shot at 10 different animal face targets from 10-40 paces.",
            distanceBreakdown: [
                { distance: "10-40 paces", arrows: 60 }
            ],
            maxScore: "300"
        },

        // KA Custom Clout Rounds
        {
            name: "3-Way Clout",
            category: "clout", measurement: "imperial",
            isOfficial: false,
            description: "KA custom clout with 3 flags at different distances in metric clout circles.",
            distanceBreakdown: [
                { distance: "180 paces", arrows: 12 },
                { distance: "120 paces", arrows: 12 },
                { distance: "60 paces", arrows: 12 }
            ],
            maxScore: "180"
        },
        {
            name: "Black Bear",
            category: "clout", measurement: "imperial",
            isOfficial: false,
            description: "3D bear target placed in a metric clout circle at long distance.",
            distanceBreakdown: [
                { distance: "180 paces", arrows: 12 },
                { distance: "140 paces", arrows: 12 },
                { distance: "100 paces", arrows: 12 }
            ],
            maxScore: "216"
        },
        {
            name: "Easter Bunny",
            category: "clout", measurement: "imperial",
            isOfficial: false,
            description: "3D bunny target placed in a metric clout circle. Popular Easter event.",
            distanceBreakdown: [
                { distance: "180 paces", arrows: 12 },
                { distance: "140 paces", arrows: 12 },
                { distance: "100 paces", arrows: 12 }
            ],
            maxScore: "216"
        },
        {
            name: "Stag",
            category: "clout", measurement: "imperial",
            isOfficial: false,
            description: "3D stag target placed in a metric clout circle at long distance.",
            distanceBreakdown: [
                { distance: "180 paces", arrows: 24 },
                { distance: "140 paces", arrows: 24 }
            ],
            maxScore: "288"
        },
        {
            name: "Wolf",
            category: "clout", measurement: "imperial",
            isOfficial: false,
            description: "3D wolf target placed in a metric clout circle.",
            distanceBreakdown: [
                { distance: "160 paces", arrows: 24 },
                { distance: "120 paces", arrows: 24 }
            ],
            maxScore: "288"
        },
        {
            name: "Coyote",
            category: "clout", measurement: "imperial",
            isOfficial: false,
            description: "3D coyote target placed in a metric clout circle.",
            distanceBreakdown: [
                { distance: "120 paces", arrows: 24 },
                { distance: "80 paces", arrows: 24 }
            ],
            maxScore: "288"
        },
        {
            name: "Hog",
            category: "clout", measurement: "imperial",
            isOfficial: false,
            description: "3D hog target placed in a metric clout circle.",
            distanceBreakdown: [
                { distance: "140 paces", arrows: 24 },
                { distance: "100 paces", arrows: 24 }
            ],
            maxScore: "288"
        },
        {
            name: "Valentine 120",
            category: "clout", measurement: "imperial",
            isOfficial: false,
            description: "Heart-faced boss placed in an imperial clout circle. Valentine's Day special.",
            distanceBreakdown: [
                { distance: "120 paces", arrows: 24 },
                { distance: "80 paces", arrows: 24 }
            ],
            maxScore: "240"
        },
        {
            name: "Boxing Day Clout",
            category: "clout", measurement: "imperial",
            isOfficial: false,
            description: "Snowman cut-out placed in a metric clout circle. Festive fun round.",
            distanceBreakdown: [
                { distance: "160 paces", arrows: 12 },
                { distance: "120 paces", arrows: 12 },
                { distance: "100 paces", arrows: 12 }
            ],
            maxScore: "180"
        },
        {
            name: "Halloween Clout",
            category: "clout", measurement: "imperial",
            isOfficial: false,
            description: "Night-time clout shoot with pumpkin target worth 10 points.",
            distanceBreakdown: [
                { distance: "160 paces", arrows: 12 },
                { distance: "120 paces", arrows: 12 },
                { distance: "100 paces", arrows: 12 }
            ],
            maxScore: "180"
        },
        {
            name: "New Year Rove",
            category: "clout", measurement: "imperial",
            isOfficial: false,
            description: "Multiple clout flags at various distances in metric clout circles.",
            distanceBreakdown: [
                { distance: "Various", arrows: 48 }
            ],
            maxScore: "240"
        },
        {
            name: "Cloth Of Gold",
            category: "clout", measurement: "imperial",
            isOfficial: false,
            description: "Gold-faced boss placed in a square target area at 150 paces. 2-zone scoring.",
            distanceBreakdown: [
                { distance: "150 paces", arrows: 48 }
            ],
            maxScore: "96"
        },
        {
            name: "West Lodge Square",
            category: "clout", measurement: "imperial",
            isOfficial: false,
            description: "Flag in a square at 60 yards. High ping shot format.",
            distanceBreakdown: [
                { distance: "60 yards", arrows: 24 }
            ],
            maxScore: "24"
        },
        {
            name: "Shield Wall",
            category: "outdoor", measurement: "imperial",
            isOfficial: false,
            description: "10 low touching targets in a wall formation. Unique KA format.",
            distanceBreakdown: [
                { distance: "120 paces", arrows: 36 },
                { distance: "100 paces", arrows: 24 },
                { distance: "80 paces", arrows: 12 }
            ],
            maxScore: "720"
        },

        // KA Custom Outdoor Rounds
        {
            name: "Kettering",
            category: "outdoor", measurement: "imperial",
            isOfficial: false,
            description: "KA signature round shot at increasing distances on 122cm faces.",
            distanceBreakdown: [
                { distance: "80 yards", arrows: 24 },
                { distance: "100 yards", arrows: 24 },
                { distance: "120 yards", arrows: 24 }
            ],
            maxScore: "360"
        },
        {
            name: "Midsummer",
            category: "outdoor", measurement: "imperial",
            isOfficial: false,
            description: "Shot at low targets from decreasing distances on 122cm faces.",
            distanceBreakdown: [
                { distance: "60 yards", arrows: 15 },
                { distance: "50 yards", arrows: 15 },
                { distance: "40 yards", arrows: 15 },
                { distance: "30 yards", arrows: 15 }
            ],
            maxScore: "300"
        },
        {
            name: "Flight",
            category: "outdoor", measurement: "imperial",
            isOfficial: true,
            description: "Distance shooting competition - aim is to shoot as far as possible.",
            distanceBreakdown: [
                { distance: "Maximum", arrows: 24 }
            ],
            maxScore: "N/A"
        },

        // KA Custom Fun / Novelty Rounds
        {
            name: "Christmas Turkey",
            category: "fun",
            isOfficial: false,
            description: "Indoor novelty round shot at a turkey face target. Festive fun!",
            distanceBreakdown: [
                { distance: "20 yards", arrows: 48 }
            ],
            maxScore: "240"
        },
        {
            name: "Darts",
            category: "fun",
            isOfficial: false,
            description: "Shot at a darts-style face at 30 yards. Scored like pub darts!",
            distanceBreakdown: [
                { distance: "30 yards", arrows: 36 }
            ],
            maxScore: "Varies"
        },
        {
            name: "Ghost",
            category: "fun",
            isOfficial: false,
            description: "Halloween indoor round shot at a ghost face target.",
            distanceBreakdown: [
                { distance: "20 yards", arrows: 36 }
            ],
            maxScore: "180"
        },
        {
            name: "Snowman",
            category: "fun",
            isOfficial: false,
            description: "Indoor round shot at a cut-out snowman face. Reverse scoring.",
            distanceBreakdown: [
                { distance: "20 yards", arrows: 36 }
            ],
            maxScore: "360"
        },
        {
            name: "Star",
            category: "fun",
            isOfficial: false,
            description: "Indoor round shot at a cut-out star face on 80cm boss. Reverse scoring.",
            distanceBreakdown: [
                { distance: "20 yards", arrows: 36 }
            ],
            maxScore: "360"
        },
        {
            name: "Valentine",
            category: "fun",
            isOfficial: false,
            description: "Indoor round shot at a heart face target. Perfect for Valentine's Day!",
            distanceBreakdown: [
                { distance: "20 yards", arrows: 48 }
            ],
            maxScore: "240"
        },
    ];

    // Filter rounds based on active filter and sort alphabetically
    const filteredRounds = (activeFilter === 'all'
        ? rounds
        : rounds.filter(round => round.category === activeFilter)
    ).sort((a, b) => a.name.localeCompare(b.name));

    // Get category info for display
    const getCategoryInfo = (categoryId) => {
        return categories.find(c => c.id === categoryId) || categories[0];
    };

    return (
        <div className="min-h-screen py-12 md:py-20">
            <SEO
                title="Archery Rounds | Kettering Archers"
                description="Learn about archery rounds shot in the UK: indoor, outdoor, imperial, metric, and clout. Guide to Portsmouth, WA 1440, York, and other archery formats."
            />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold text-forest-900 mb-4">
                        Archery <span className="gradient-text">Rounds</span>
                    </h1>
                    <p className="text-charcoal-600 text-lg max-w-2xl mx-auto">
                        Learn about the different types of archery rounds shot in the UK.
                        From indoor to outdoor, imperial to metric - there's a round for everyone.
                    </p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveFilter(category.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${activeFilter === category.id
                                ? `${category.color} ring-2 ring-offset-2 ring-forest-500 scale-105`
                                : 'bg-white/50 text-charcoal-600 border-charcoal-200 hover:bg-white hover:border-charcoal-300'
                                }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Active Filter Indicator */}
                {activeFilter !== 'all' && (
                    <div className="text-center mb-8">
                        <button
                            onClick={() => setActiveFilter('all')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200 transition-colors text-sm"
                        >
                            <span>Showing: <strong>{getCategoryInfo(activeFilter).label}</strong></span>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* Results Count */}
                <p className="text-center text-charcoal-500 text-sm mb-8">
                    Showing {filteredRounds.length} round{filteredRounds.length !== 1 ? 's' : ''}
                </p>

                {/* Rounds Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {filteredRounds.map((round, index) => (
                        <RoundCard
                            key={round.name}
                            round={round}
                            categoryInfo={getCategoryInfo(round.category)}
                        />
                    ))}
                </div>

                {/* Legend */}
                <div className="glass-card p-6 md:p-8 mb-8">
                    <h3 className="font-semibold text-forest-900 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Round Categories
                    </h3>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-forest-800">Imperial</span>
                            <p className="text-charcoal-600">Distances in yards/feet (traditional British)</p>
                        </div>
                        <div>
                            <span className="font-medium text-forest-800">Metric</span>
                            <p className="text-charcoal-600">Distances in metres (World Archery standard)</p>
                        </div>
                        <div>
                            <span className="font-medium text-forest-800">Clout</span>
                            <p className="text-charcoal-600">Long-distance shooting at a ground target</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-charcoal-200 flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-forest-100 text-forest-700 text-xs font-medium border border-forest-300">Official</span>
                            <span className="text-charcoal-600">Archery GB / World Archery recognised</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-gold-100 text-gold-700 text-xs font-medium border border-gold-300">KA Custom</span>
                            <span className="text-charcoal-600">Kettering Archers club rounds</span>
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="glass-card p-6 md:p-8 border-forest-500/30">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-forest-100 flex items-center justify-center shrink-0">
                            <svg className="w-6 h-6 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-forest-900 mb-2">Want to Learn More?</h3>
                            <p className="text-charcoal-600 text-sm leading-relaxed">
                                The rounds listed here are the most common ones shot in the UK. For a complete list of
                                rounds and their rules, visit the{' '}
                                <a
                                    href="https://archerygb.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-forest-600 hover:underline"
                                >
                                    Archery GB website
                                </a>
                                . Our coaches are always happy to explain rounds and help you choose which to shoot.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArcheryRounds;
