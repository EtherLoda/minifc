import { MatchEvent } from '@/lib/api';
import { generateEventDescription, getEventIcon } from '@/utils/matchEventDescriptions';

interface CommentaryEventProps {
    event: MatchEvent;
    homeTeamName: string;
    awayTeamName: string;
}

export function CommentaryEvent({ event, homeTeamName, awayTeamName }: CommentaryEventProps) {
    const description = generateEventDescription(event);
    const icon = getEventIcon(event);
    const eventData = event.eventData || event.data;
    const side = (eventData?.teamName || (event as any).teamName) === homeTeamName ? 'home' : 'away';
    const teamColor = side === 'home' ? '#6ECDEA' : '#D15E5E';

    return (
        <div
            className="group relative flex items-start gap-4 p-4 rounded-xl border border-emerald-500/10 dark:border-white/5 transition-all hover:border-emerald-500/30 hover:shadow-md bg-white/50 dark:bg-white/5 backdrop-blur-sm"
        >
            {/* Visual Indicator (Side Bar) */}
            <div
                className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full"
                style={{ backgroundColor: teamColor }}
            />

            <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-inner"
                style={{ backgroundColor: `${teamColor}22` }}
            >
                <span className="text-xl group-hover:scale-110 transition-transform">{icon}</span>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {event.minute ?? 0}&apos;
                    </span>
                    {(eventData?.playerName || (eventData?.playerNames && eventData.playerNames.length > 0)) && (
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {eventData.playerName || eventData.playerNames[0]}
                        </span>
                    )}
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                    {description}
                </p>

                {eventData?.xG !== undefined && (
                    <div className="mt-2 flex items-center gap-2">
                        <div className="h-1 w-12 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500/50"
                                style={{ width: `${Math.min(eventData.xG * 100, 100)}%` }}
                            />
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">
                            xG {eventData.xG.toFixed(2)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
