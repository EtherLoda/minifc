import { MatchEvent } from '@/lib/api';
import { CommentaryEvent } from './CommentaryEvent';
import { MajorEvent } from './MajorEvent';

interface EventTimelineProps {
    events: MatchEvent[];
    isLive: boolean;
    currentMinute?: number;
    currentScore?: { home: number; away: number };
}

export function EventTimeline({ events, isLive, currentMinute, currentScore }: EventTimelineProps) {
    const renderEvent = (event: MatchEvent) => {
        const eventType = (event.typeName || event.type || '').toLowerCase();
        
        // For goal events, use the score captured at the time of the event
        // This shows progressive score (1-0, then 2-0) instead of final score (2-0 for all)
        const eventData = event.eventData || event.data;
        const eventScore = eventData?.scoreAfterEvent || currentScore;
        
        // Major events (goals, cards) get special treatment
        if (['goal', 'red_card', 'yellow_card'].includes(eventType)) {
            return <MajorEvent key={event.id} event={event} currentScore={eventScore} />;
        }
        
        // Use CommentaryEvent style for all regular events for consistency
        return <CommentaryEvent key={event.id} event={event} />;
    };
    
    return (
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                📋 Match Events
                {isLive && currentMinute !== undefined && (
                    <span className="text-sm text-gray-400">
                        ({events.length} events • {currentMinute}&apos;)
                    </span>
                )}
            </h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                {events.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">
                        {isLive ? 'No events yet...' : 'Match will start soon'}
                    </p>
                ) : (
                    events.map((event) => renderEvent(event))
                )}
                
                {/* Show typing indicator for live matches */}
                {isLive && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm pt-4">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span>Live coverage...</span>
                    </div>
                )}
            </div>
            
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
}
