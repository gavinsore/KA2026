import { useParams, Link } from 'react-router-dom';
import { getCompetitionById } from '../data/competitions';
import CompetitionEntryForm from '../components/CompetitionEntryForm';

const CompetitionDetails = () => {
    const { competitionId } = useParams();
    const competition = getCompetitionById(competitionId);

    // Competition not found
    if (!competition) {
        return (
            <div className="min-h-screen py-12 md:py-20 flex items-center justify-center">
                <div className="max-w-md mx-auto px-4 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-charcoal-100 flex items-center justify-center">
                        <svg className="w-10 h-10 text-charcoal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-forest-900 mb-4">Competition Not Found</h1>
                    <p className="text-charcoal-600 mb-8">
                        Sorry, we couldn't find the competition you're looking for.
                    </p>
                    <Link to="/events" className="btn-primary">
                        Back to Events
                    </Link>
                </div>
            </div>
        );
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Check if entries are closed
    const entriesClosed = new Date(competition.closingDate) < new Date();

    return (
        <div className="min-h-screen py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    to="/events"
                    className="inline-flex items-center gap-2 text-forest-600 hover:text-forest-700 mb-8 group"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Events
                </Link>

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100 text-gold-700 font-medium text-sm mb-4">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Competition
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-forest-900 mb-4">
                        {competition.name}
                    </h1>
                    <p className="text-charcoal-600 text-lg">
                        {formatDate(competition.date)} • {competition.time}
                    </p>
                    <p className="text-charcoal-500 mt-2">
                        📍 {competition.location}
                    </p>
                </div>

                {/* Competition Details */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    {/* Entry Fee */}
                    <div className="glass-card p-6 border-gold-500/30">
                        <h3 className="text-lg font-semibold text-forest-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Entry Fee
                        </h3>
                        <div className="space-y-2 text-charcoal-600">
                            <p><span className="font-medium">Adults:</span> £{competition.entryFee.adult}</p>
                            <p><span className="font-medium">Juniors:</span> £{competition.entryFee.junior}</p>
                        </div>
                    </div>

                    {/* Closing Date */}
                    <div className="glass-card p-6 border-forest-500/30">
                        <h3 className="text-lg font-semibold text-forest-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Entry Deadline
                        </h3>
                        <p className={`font-medium ${entriesClosed ? 'text-red-500' : 'text-forest-600'}`}>
                            {entriesClosed ? 'Entries Closed' : formatDate(competition.closingDate)}
                        </p>
                        {competition.maxEntries && (
                            <p className="text-sm text-charcoal-500 mt-1">Maximum {competition.maxEntries} entries</p>
                        )}
                    </div>
                </div>

                {/* Payment Details */}
                <div className="glass-card p-6 md:p-8 mb-6">
                    <h3 className="text-lg font-semibold text-forest-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Payment Details
                    </h3>
                    <pre className="text-charcoal-600 text-sm whitespace-pre-wrap font-sans">
                        {competition.paymentDetails}
                    </pre>
                </div>

                {/* Judges & Medals */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-forest-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Judges
                        </h3>
                        <ul className="space-y-1 text-charcoal-600 text-sm">
                            {competition.judges.map((judge, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-forest-500"></span>
                                    {judge}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-forest-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Medals & Awards
                        </h3>
                        <p className="text-charcoal-600 text-sm">{competition.medals}</p>
                    </div>
                </div>

                {/* Eligible Classes & Distances */}
                <div className="glass-card p-6 md:p-8 mb-6">
                    <h3 className="text-lg font-semibold text-forest-900 mb-4">Eligible Categories</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium text-charcoal-700 mb-2">Bow Classes</h4>
                            <div className="flex flex-wrap gap-2">
                                {competition.eligibleClasses.map(cls => (
                                    <span key={cls} className="px-3 py-1 rounded-full bg-forest-100 text-forest-700 text-sm font-medium">
                                        {cls}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-charcoal-700 mb-2">Distances</h4>
                            <div className="flex flex-wrap gap-2">
                                {competition.eligibleDistances.map(dist => (
                                    <span key={dist} className="px-3 py-1 rounded-full bg-gold-100 text-gold-700 text-sm font-medium">
                                        {dist}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dress Code */}
                <div className="glass-card p-6 md:p-8 mb-6 border-forest-500/30">
                    <h3 className="text-lg font-semibold text-forest-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-forest-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Dress Code (Archery GB Regulations)
                    </h3>
                    <p className="text-charcoal-600 text-sm">{competition.dressCode}</p>
                </div>

                {/* Additional Info */}
                {competition.additionalInfo && (
                    <div className="glass-card p-6 md:p-8 mb-10 border-gold-500/30">
                        <h3 className="text-lg font-semibold text-forest-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Additional Information
                        </h3>
                        <p className="text-charcoal-600 text-sm">{competition.additionalInfo}</p>
                    </div>
                )}

                {/* Entry Form or Closed Message */}
                {entriesClosed ? (
                    <div className="glass-card p-8 text-center border-red-500/30">
                        <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-forest-900 mb-2">Entries Closed</h3>
                        <p className="text-charcoal-600">
                            Unfortunately, entries for this competition have now closed.
                        </p>
                    </div>
                ) : competition.isOpen ? (
                    <CompetitionEntryForm competition={competition} />
                ) : (
                    <div className="glass-card p-8 text-center border-charcoal-500/30">
                        <svg className="w-16 h-16 mx-auto mb-4 text-charcoal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-forest-900 mb-2">Entries Not Yet Open</h3>
                        <p className="text-charcoal-600">
                            Entries for this competition are not yet open. Please check back later.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompetitionDetails;
