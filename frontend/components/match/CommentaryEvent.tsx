import { MatchEvent } from '@/lib/api';
import { generateEventDescription, getEventIcon } from '@/utils/matchEventDescriptions';

interface CommentaryEventProps {
    event: MatchEvent;
}

export function CommentaryEvent({ event }: CommentaryEventProps) {
    const description = generateEventDescription(event);
    const icon = getEventIcon(event);
    const eventData = event.eventData || event.data;
    
    return (
        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-900/20 to-transparent rounded-lg border-l-4 border-blue-500/50 hover:bg-blue-900/30 transition-all">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">{icon}</span>
            </div>
            
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-blue-400 px-2 py-1 bg-blue-500/20 rounded">
                        {event.minute ?? 0}&apos;
                    </span>
                    {eventData?.playerName && (
                        <span className="text-sm font-semibold text-white">
                            {eventData.playerName}
                        </span>
                    )}
                    {!eventData?.playerName && eventData?.playerNames && eventData.playerNames.length > 0 && (
                        <span className="text-sm font-semibold text-white">
                            {eventData.playerNames[0]}
                        </span>
                    )}
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed">
                    {description}
                </p>
                
                {eventData?.xG && (
                    <div className="mt-2 text-xs text-gray-500">
                        Expected Goals: {eventData.xG.toFixed(2)}
                    </div>
                )}
            </div>
        </div>
    );
}
