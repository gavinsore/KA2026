// ============================================================
// COMPETITION DATA
// Add new competitions by adding entries to the competitions array.
// Each competition will automatically get its own details page at:
// /competitions/{id}
// ============================================================

export const competitions = [
    {
        id: 'spring-target-2025',
        name: 'Spring Target Championship 2025',
        date: '2025-04-15',
        time: '09:00 AM',
        location: 'Kettering Sports Ground',
        entryFee: {
            adult: 15,
            junior: 10
        },
        paymentDetails: 'Payment by bank transfer to:\nAccount Name: Kettering Archers\nSort Code: 12-34-56\nAccount Number: 12345678\nReference: Your name + "Spring2026"',
        judges: ['John Smith (AGB Judge)', 'Jane Doe (AGB Judge)'],
        medals: 'Gold, Silver, and Bronze medals awarded for each category. Trophies for overall winners.',
        eligibleClasses: ['Recurve', 'Compound', 'Barebow', 'Longbow', 'Traditional'],
        eligibleDistances: ['20m', '30m', '50m', '70m'],
        dressCode: 'Archery GB dress regulations apply. Archers must wear club colours or plain white/dark clothing. No denim or camouflage patterns. Closed-toe shoes must be worn at all times.',
        gdprNotice: 'By submitting this form, you consent to Kettering Archers storing and processing your personal data for the purpose of administering this competition. Your information will be shared with Archery GB for records purposes. Photos and videos may be taken during the event for promotional purposes. Please contact us if you wish to opt out of photography.',
        closingDate: '2025-04-01',
        additionalInfo: 'Assembly at 8:30 AM. Sighters begin at 9:00 AM. Please bring your own lunch or pre-order a meal when entering. Hot drinks will be available throughout the day.',
        maxEntries: 60,
        isOpen: true
    },
    {
        id: 'ABM-2026',
        name: 'Angela Bray Memorial Clout 2026',
        date: '2026-04-15',
        time: '09:00 AM',
        location: 'Kettering Sports Ground',
        entryFee: {
            adult: 15,
            junior: 10
        },
        paymentDetails: 'Payment by bank transfer to:\nAccount Name: Kettering Archers\nSort Code: 12-34-56\nAccount Number: 12345678\nReference: Your name + "Spring2026"',
        judges: ['John Smith (AGB Judge)', 'Jane Doe (AGB Judge)'],
        medals: 'Gold, Silver, and Bronze medals awarded for each category. Trophies for overall winners.',
        eligibleClasses: ['Recurve', 'Compound', 'Barebow', 'Longbow', 'FlatBow', 'Traditional', 'Horsebow'],
        eligibleDistances: ['75m', '90m', '110m', '125m', '165m', '185m'],
        dressCode: 'Archery GB dress regulations apply. Archers must wear club colours or plain white/dark clothing. No denim or camouflage patterns. Closed-toe shoes must be worn at all times.',
        gdprNotice: 'By submitting this form, you consent to Kettering Archers storing and processing your personal data for the purpose of administering this competition. Your information will be shared with Archery GB for records purposes. Photos and videos may be taken during the event for promotional purposes. Please contact us if you wish to opt out of photography.',
        closingDate: '2026-04-01',
        additionalInfo: 'Anyone wishing to take photographs must register with the tournament organiser. Archers must have current Archery GB membership and may be asked to produce their membership cards.For a 50+ archer to claim a 50+ tassle they must shoot the 50+ distance. Assembly at 8:30 AM. Sighters begin at 9:00 AM. Please bring your own lunch or pre-order a meal when entering. Hot drinks will be available throughout the day.',
        maxEntries: 80,
        isOpen: true
    },
    {
        id: 'summer-clout-2026',
        name: 'Summer Clout Competition 2026',
        date: '2026-06-20',
        time: '10:00 AM',
        location: 'Kettering Sports Ground',
        entryFee: {
            adult: 12,
            junior: 8
        },
        paymentDetails: 'Payment by bank transfer to:\nAccount Name: Kettering Archers\nSort Code: 12-34-56\nAccount Number: 12345678\nReference: Your name + "Clout2026"',
        judges: ['Sarah Johnson (AGB Judge)'],
        medals: 'Medals for 1st, 2nd, and 3rd place in each category.',
        eligibleClasses: ['Recurve', 'Compound', 'Barebow', 'Longbow'],
        eligibleDistances: ['140 yards', '180 yards'],
        dressCode: 'Archery GB dress regulations apply. Club colours or plain clothing required.',
        gdprNotice: 'By submitting this form, you consent to Kettering Archers storing and processing your personal data for the purpose of administering this competition. Your information will be shared with Archery GB for records purposes.',
        closingDate: '2026-06-06',
        additionalInfo: 'Clout-specific equipment required. Please ensure arrows are suitable for clout shooting.',
        maxEntries: 40,
        isOpen: true
    }
];

// Helper function to get a competition by ID
export const getCompetitionById = (id) => {
    return competitions.find(comp => comp.id === id);
};

// Helper function to get all open competitions (excludes past competitions)
export const getOpenCompetitions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    return competitions.filter(comp => {
        const compDate = new Date(comp.date);
        return comp.isOpen && compDate >= today;
    });
};
