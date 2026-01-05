import { MatchEvent } from '@/lib/api';
import { generateEventDescription } from '@/utils/matchEventDescriptions';

interface StatEventProps {
    event: MatchEvent;
}

export function StatEvent({ event }: StatEventProps) {
    const description = generateEventDescription(event);
    const eventData = event.eventData || event.data;
    
    return (
        <div className="flex items-center gap-4 p-3 bg-black/40 rounded-lg border border-white/5 hover:border-white/10 transition-all">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">{event.minute ?? 0}&apos;</span>
            </div>
            
            <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-300">{description}</span>
                </div>
                
                {eventData?.zone && (
                    <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {eventData.zone}
                    </span>
                )}
            </div>
        </div>
    );
}
