import { MatchEvent } from '@/lib/api';
import { generateEventDescription } from '@/utils/matchEventDescriptions';

interface MajorEventProps {
    event: MatchEvent;
    currentScore?: { home: number; away: number };
}

export function MajorEvent({ event, currentScore }: MajorEventProps) {
    const eventType = (event.typeName || event.type || '').toLowerCase();
    const isGoal = eventType === 'goal';
    const isRedCard = eventType === 'red_card';
    const isYellowCard = eventType === 'yellow_card';
    
    const description = generateEventDescription(event);
    const eventData = event.eventData || event.data;
    
    // Fallback if eventType is missing
    const eventTitle = isGoal ? 'GOAL!' : isRedCard ? 'RED CARD!' : isYellowCard ? 'YELLOW CARD!' : 'MAJOR EVENT';
    
    return (
        <div className={`relative overflow-hidden rounded-2xl p-6 border-2 ${
            isGoal 
                ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-500/50' 
                : isRedCard
                ? 'bg-gradient-to-r from-red-900/40 to-rose-900/40 border-red-500/50'
                : 'bg-gradient-to-r from-yellow-900/40 to-amber-900/40 border-yellow-500/50'
        }`}>
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`text-4xl ${isGoal ? 'animate-bounce' : 'animate-pulse'}`}>
                            {isGoal ? '⚽' : isRedCard ? '🟥' : '🟨'}
                        </div>
                        <div>
                            <div className="text-xl font-bold text-white">
                                {eventTitle}
                            </div>
                            <div className="text-sm text-gray-400">
                                {event.minute ?? 0}&apos; {event.second ?? 0}&quot;
                            </div>
                        </div>
                    </div>
                    
                    {isGoal && currentScore && (
                        <div className="text-2xl font-bold text-white">
                            {currentScore.home}-{currentScore.away}
                        </div>
                    )}
                </div>
                
                <p className="text-lg text-white mb-3">
                    {description}
                </p>
                
                {eventData?.playerName && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <span>👤</span>
                        </div>
                        <span className="text-sm font-semibold text-white">
                            {eventData.playerName}
                        </span>
                    </div>
                )}
                {!eventData?.playerName && eventData?.playerNames && eventData.playerNames.length > 0 && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <span>👤</span>
                        </div>
                        <span className="text-sm font-semibold text-white">
                            {eventData.playerNames[0]}
                        </span>
                        {eventData.playerNames.length > 1 && (
                            <>
                                <span className="text-sm text-gray-400">•</span>
                                <span className="text-sm text-gray-300">
                                    Assist: {eventData.playerNames[1]}
                                </span>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
