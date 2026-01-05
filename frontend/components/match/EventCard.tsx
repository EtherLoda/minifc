import { MatchEvent } from '@/lib/api';
import { generateEventDescription, getEventTypeDisplay } from '@/utils/matchEventDescriptions';

interface EventCardProps {
    event: MatchEvent;
}

export function EventCard({ event }: EventCardProps) {
    const description = generateEventDescription(event);
    const eventTypeDisplay = getEventTypeDisplay(event);
    const eventData = event.eventData || event.data;
    
    return (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-all shadow-lg hover:shadow-xl">
            <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-bold text-emerald-400 px-2 py-1 bg-emerald-500/20 rounded-full">
                    {event.minute ?? 0}&apos; {event.second ?? 0}&quot;
                </span>
                
                <span className="text-xs text-gray-500 uppercase">
                    {eventTypeDisplay}
                </span>
            </div>
            
            <p className="text-sm text-white leading-relaxed">
                {description}
            </p>
            
            {eventData?.playerNames && eventData.playerNames.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-xs">👤</span>
                    </div>
                    <span className="text-xs text-gray-400">
                        {eventData.playerNames.join(', ')}
                    </span>
                </div>
            )}
        </div>
    );
}
