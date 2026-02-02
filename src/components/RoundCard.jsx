const RoundCard = ({ round }) => {
    return (
        <div className="glass-card p-6 hover:border-gold-500/30 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white group-hover:text-gold-400 transition-colors">
                    {round.name}
                </h3>
                {round.type && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${round.type === 'Target' ? 'bg-forest-600/20 text-forest-400' :
                            round.type === 'Field' ? 'bg-gold-600/20 text-gold-400' :
                                round.type === 'Clout' ? 'bg-purple-600/20 text-purple-400' :
                                    'bg-charcoal-600/20 text-charcoal-300'
                        }`}>
                        {round.type}
                    </span>
                )}
            </div>

            <p className="text-charcoal-400 text-sm mb-4 leading-relaxed">
                {round.description}
            </p>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                {round.distances && (
                    <div className="col-span-2">
                        <span className="text-charcoal-500 text-xs uppercase tracking-wide">Distances</span>
                        <p className="text-charcoal-200">{round.distances}</p>
                    </div>
                )}
                {round.arrows && (
                    <div>
                        <span className="text-charcoal-500 text-xs uppercase tracking-wide">Arrows</span>
                        <p className="text-charcoal-200">{round.arrows}</p>
                    </div>
                )}
                {round.maxScore && (
                    <div>
                        <span className="text-charcoal-500 text-xs uppercase tracking-wide">Max Score</span>
                        <p className="text-charcoal-200">{round.maxScore}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoundCard;
