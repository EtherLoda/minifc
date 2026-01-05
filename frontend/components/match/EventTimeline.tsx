import { MatchEvent } from '@/lib/api';
import { CommentaryEvent } from './CommentaryEvent';
import { MajorEvent } from './MajorEvent';

interface EventTimelineProps {
    events: MatchEvent[];
    isLive: boolean;
    currentMinute?: number;
    currentScore?: { home: number; away: number };
    homeTeamName: string;
    awayTeamName: string;
}

export function EventTimeline({ events, isLive, currentMinute, currentScore, homeTeamName, awayTeamName }: EventTimelineProps) {
    const renderEvent = (event: MatchEvent) => {
        const eventType = (event.typeName || event.type || '').toLowerCase();

        // For goal events, use the score captured at the time of the event
        // This shows progressive score (1-0, then 2-0) instead of final score (2-0 for all)
        const eventData = event.eventData || event.data;
        const eventScore = eventData?.scoreAfterEvent || currentScore;

        // Major events (goals, cards) get special treatment
        if (['goal', 'red_card', 'yellow_card'].includes(eventType)) {
            return <MajorEvent key={event.id} event={event} currentScore={eventScore} homeTeamName={homeTeamName} awayTeamName={awayTeamName} />;
        }

        // Use CommentaryEvent style for all regular events for consistency
        return <CommentaryEvent key={event.id} event={event} homeTeamName={homeTeamName} awayTeamName={awayTeamName} />;
    };

    return (
        <div className="rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-white dark:bg-emerald-950/20 shadow-lg overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b-2 border-emerald-500/40 dark:border-emerald-500/30 bg-white/80 dark:bg-emerald-950/40 backdrop-blur-sm">
                <h3 className="text-lg font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                    📋 Match Events
                    {isLive && currentMinute !== undefined && (
                        <span className="text-xs font-medium text-emerald-600/60 dark:text-emerald-400/60 ml-2">
                            ({events.length} • {currentMinute}&apos;)
                        </span>
                    )}
                </h3>
            </div>

            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar flex-1 bg-slate-50/30 dark:bg-transparent">
                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 opacity-40">
                        <div className="text-4xl mb-2">🚥</div>
                        <p className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                            {isLive ? 'Waiting for kickoff...' : 'Match starts soon'}
                        </p>
                    </div>
                ) : (
                    events.map((event) => renderEvent(event))
                )}

                {/* Show typing indicator for live matches */}
                {isLive && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 self-start animate-pulse">
                        <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Live coverage...</span>
                    </div>
                )}
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(16, 185, 129, 0.2);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.4);
                }
            `}</style>
        </div>
    );
}
