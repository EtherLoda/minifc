import { MatchEvent } from '@/lib/api';
import { generateEventDescription } from '@/utils/matchEventDescriptions';

interface MajorEventProps {
    event: MatchEvent;
    currentScore?: { home: number; away: number };
    homeTeamName: string;
    awayTeamName: string;
}

export function MajorEvent({ event, currentScore, homeTeamName, awayTeamName }: MajorEventProps) {
    const eventType = (event.typeName || event.type || '').toLowerCase();
    const isGoal = eventType === 'goal';
    const isRedCard = eventType === 'red_card';
    const isYellowCard = eventType === 'yellow_card';

    const description = generateEventDescription(event);
    const eventData = event.eventData || event.data;

    const side = (eventData?.teamName || (event as any).teamName) === homeTeamName ? 'home' : 'away';
    const teamColor = side === 'home' ? '#6ECDEA' : '#D15E5E';

    // Fallback if eventType is missing
    const eventTitle = isGoal ? 'GOAL!' : isRedCard ? 'RED CARD!' : isYellowCard ? 'YELLOW CARD!' : 'MAJOR EVENT';

    return (
        <div
            className="relative overflow-hidden rounded-2xl p-6 border-b-4 shadow-xl transition-all hover:scale-[1.01]"
            style={{
                background: isGoal
                    ? `linear-gradient(135deg, ${teamColor}15, ${teamColor}05)`
                    : isRedCard
                        ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))'
                        : 'linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(234, 179, 8, 0.05))',
                borderColor: isGoal ? teamColor : isRedCard ? '#ef4444' : '#eab308'
            }}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-white/10 dark:bg-black/20 shadow-inner ${isGoal ? 'animate-bounce' : 'animate-pulse'}`}>
                            <span className="text-4xl filter drop-shadow-lg">
                                {isGoal ? '⚽' : isRedCard ? '🟥' : '🟨'}
                            </span>
                        </div>
                        <div>
                            <div className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
                                {eventTitle}
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mt-1 opacity-60">
                                {event.minute ?? 0}&apos; {event.second ?? 0}&quot;
                            </div>
                        </div>
                    </div>

                    {isGoal && currentScore && (
                        <div className="bg-black/5 dark:bg-white/5 px-4 py-2 rounded-xl border border-black/5 dark:border-white/5 shadow-inner">
                            <div className="text-2xl font-black tabular-nums text-slate-900 dark:text-white">
                                {currentScore.home} - {currentScore.away}
                            </div>
                        </div>
                    )}
                </div>

                <p className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-4">
                    {description}
                </p>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-emerald-500/10 border border-emerald-500/20 shadow-sm flex items-center justify-center overflow-hidden">
                        <span className="text-xl">👤</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">
                            {eventData?.playerName || (eventData?.playerNames && eventData.playerNames[0]) || 'Unknown Player'}
                        </span>
                        {isGoal && eventData?.playerNames && eventData.playerNames.length > 1 && (
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                Assist: {eventData.playerNames[1]}
                            </span>
                        )}
                        {(isRedCard || isYellowCard) && (
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {isRedCard ? 'Sent Off' : 'Booking'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
