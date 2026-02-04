const RoundCard = ({ round }) => {
    const getTypeColor = (type) => {
        switch (type?.toLowerCase()) {
            case 'target':
                return 'bg-forest-100 text-forest-700 border border-forest-300';
            case 'field':
                return 'bg-gold-100 text-gold-700 border border-gold-300';
            case 'clout':
                return 'bg-purple-100 text-purple-700 border border-purple-300';
            default:
                return 'bg-charcoal-100 text-charcoal-600 border border-charcoal-300';
        }
    };

    return (
        <div className="glass-card p-6 hover:border-gold-400 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-forest-900 group-hover:text-gold-600 transition-colors">
                    {round.name}
                </h3>
                {round.type && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(round.type)}`}>
                        {round.type}
                    </span>
                )}
            </div>

            <p className="text-charcoal-600 text-sm mb-4 leading-relaxed">
                {round.description}
            </p>

            {/* Details Grid */}
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
        </div>
    );
};

export default RoundCard;
