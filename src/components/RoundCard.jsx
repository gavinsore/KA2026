const RoundCard = ({ round, categoryInfo }) => {
    // Get category color for the badge
    const getCategoryColor = (category) => {
        const colors = {
            'indoor': 'bg-blue-100 text-blue-700 border-blue-300',
            'outdoor': 'bg-forest-100 text-forest-700 border-forest-300',
            'clout': 'bg-purple-100 text-purple-700 border-purple-300',
            'field': 'bg-amber-100 text-amber-700 border-amber-300',
            'fun': 'bg-pink-100 text-pink-700 border-pink-300',
        };
        return colors[category] || 'bg-charcoal-100 text-charcoal-600 border-charcoal-300';
    };

    // Format category label for display
    const formatCategory = (category) => {
        if (!category) return '';
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    return (
        <div className="glass-card p-6 hover:border-gold-400 hover:shadow-lg transition-all duration-300 group">
            {/* Round name */}
            <h3 className="text-lg font-semibold text-forest-900 group-hover:text-gold-600 transition-colors mb-3">
                {round.name}
            </h3>

            {/* All tags in a row */}
            <div className="flex flex-wrap gap-1.5 mb-4">
                {/* Category badge */}
                {round.category && (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(round.category)}`}>
                        {categoryInfo?.label || formatCategory(round.category)}
                    </span>
                )}
                {/* Official / KA Custom badge */}
                {round.isOfficial !== undefined && (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${round.isOfficial
                        ? 'bg-forest-100 text-forest-700 border-forest-300'
                        : 'bg-gold-100 text-gold-700 border-gold-300'
                        }`}>
                        {round.isOfficial ? 'Official' : 'KA Custom'}
                    </span>
                )}
                {/* Imperial / Metric badge */}
                {round.measurement && (
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${round.measurement === 'imperial'
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-sky-50 text-sky-700 border-sky-300'
                        }`}>
                        {round.measurement === 'imperial' ? 'Imperial' : 'Metric'}
                    </span>
                )}
            </div>

            <p className="text-charcoal-600 text-sm mb-4 leading-relaxed">
                {round.description}
            </p>

            {/* Distance Breakdown - clearer format */}
            {round.distanceBreakdown && (
                <div className="mb-4">
                    <span className="text-charcoal-500 text-xs uppercase tracking-wide block mb-2">Distances & Arrows</span>
                    <div className="space-y-1">
                        {round.distanceBreakdown.map((item, index) => (
                            <div key={index} className="flex items-center text-sm">
                                <span className="text-forest-800 font-medium min-w-[100px]">{item.distance}</span>
                                <span className="text-charcoal-400 mx-2">→</span>
                                <span className="text-charcoal-700">{item.arrows} arrows</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Fallback to simple display if no breakdown */}
            {!round.distanceBreakdown && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                    {round.distances && (
                        <div className="col-span-2">
                            <span className="text-charcoal-500 text-xs uppercase tracking-wide">Distances</span>
                            <p className="text-forest-800 font-medium">{round.distances}</p>
                        </div>
                    )}
                    {round.arrows && (
                        <div>
                            <span className="text-charcoal-500 text-xs uppercase tracking-wide">Arrows</span>
                            <p className="text-forest-800 font-medium">{round.arrows}</p>
                        </div>
                    )}
                    {round.maxScore && (
                        <div>
                            <span className="text-charcoal-500 text-xs uppercase tracking-wide">Max Score</span>
                            <p className="text-forest-800 font-medium">{round.maxScore}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Max Score - always show if available and using breakdown */}
            {round.distanceBreakdown && round.maxScore && (
                <div className="mt-3 pt-3 border-t border-charcoal-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-charcoal-500">Max Score</span>
                        <span className="text-forest-800 font-semibold">{round.maxScore}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoundCard;
