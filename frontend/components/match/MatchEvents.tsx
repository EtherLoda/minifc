
import React from 'react';
import { MatchEvent } from '@/lib/api';
import { clsx } from 'clsx';
import { Goal, Shield, Flag, AlertTriangle, ArrowRightLeft, Activity, Radio, TrendingUp, Users } from 'lucide-react';

interface MatchEventsProps {
    events: MatchEvent[];
    homeTeamId: string;
    awayTeamId: string;
}

export function MatchEvents({ events, homeTeamId, awayTeamId }: MatchEventsProps) {
    // Filter out SNAPSHOT events - user doesn't want to see them
    // Check both typeName and type fields, case-insensitive with type safety
    const displayEvents = events.filter(e => {
        const typeName = typeof e.typeName === 'string' ? e.typeName.toUpperCase() : '';
        const type = typeof e.type === 'string' ? e.type.toUpperCase() : '';
        return typeName !== 'SNAPSHOT' && type !== 'SNAPSHOT';
    });
    const sortedEvents = [...displayEvents].sort((a, b) => b.minute - a.minute);

    const getIcon = (type: string) => {
        switch (type) {
            case 'GOAL': return <Goal size={16} className="text-current" />;
            case 'SAVE': return <Shield size={16} className="text-current" />;
            case 'SHOT_OFF_TARGET': 
            case 'SHOT_ON_TARGET':
            case 'SHOT':
                return <Activity size={16} className="text-current" />;
            case 'INTERCEPTION': return <ArrowRightLeft size={16} className="text-current" />;
            case 'POSSESSION':
            case 'POSSESSION_CHANGE':
                return <Radio size={16} className="text-current" />;
            case 'ATTACK':
            case 'COUNTER_ATTACK':
                return <TrendingUp size={16} className="text-current" />;
            case 'MIDFIELD_BATTLE':
            case 'TACKLE':
                return <Users size={16} className="text-current" />;
            case 'YELLOW_CARD':
                return <Flag size={16} className="text-yellow-600" />;
            case 'RED_CARD':
                return <Flag size={16} className="text-red-700" />;
            default: return <Activity size={16} className="text-current" />;
        }
    };

    return (
        <div className="rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-gradient-to-b from-emerald-50/30 to-white dark:from-emerald-950/20 dark:to-emerald-950/10 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b-2 border-emerald-500/40 dark:border-emerald-500/30 bg-white/80 dark:bg-emerald-950/40 backdrop-blur-sm">
                <h2 className="text-xl font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                    Match Events
                </h2>
                <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1">
                    {sortedEvents.length} events
                </p>
            </div>

            {/* Events List - WeChat Style */}
            <div className="max-h-[600px] overflow-y-auto p-6 space-y-4">
                {sortedEvents.length === 0 ? (
                    <div className="text-center py-12">
                        <Activity className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No events yet...</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Events will appear here during the match</p>
                    </div>
                ) : (
                    sortedEvents.map((event, index) => {
                        const isHome = event.teamId === homeTeamId;
                        const isImportant = ['GOAL', 'RED_CARD', 'PENALTY'].includes(event.type);

                        // Get bubble color based on event type
                        const getBubbleColor = () => {
                            if (isImportant) {
                                return isHome 
                                    ? 'bg-emerald-500 text-white dark:bg-emerald-600' 
                                    : 'bg-red-500 text-white dark:bg-red-600';
                            }
                            return isHome
                                ? 'bg-blue-100 text-slate-900 dark:bg-blue-900/40 dark:text-blue-100'
                                : 'bg-slate-100 text-slate-900 dark:bg-slate-800/60 dark:text-slate-100';
                        };

                        return (
                            <div
                                key={event.id}
                                className={clsx(
                                    "flex items-start gap-2 animate-in slide-in-from-top-2 fade-in-0",
                                    isHome ? "flex-row" : "flex-row-reverse"
                                )}
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                {/* Minute Badge */}
                                <div className="flex-shrink-0 mt-1">
                                    <div className="px-2 py-1 rounded-md bg-slate-200/80 dark:bg-slate-700/60 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                        {event.minute}'
                                    </div>
                                </div>

                                {/* Message Bubble - WeChat Style */}
                                <div
                                    className={clsx(
                                        "relative max-w-[75%] px-4 py-3 rounded-2xl shadow-sm",
                                        getBubbleColor(),
                                        isHome ? "rounded-tl-sm" : "rounded-tr-sm"
                                    )}
                                >
                                    {/* Event Type Header */}
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className={clsx(
                                            "flex-shrink-0",
                                            isImportant ? "text-white" : ""
                                        )}>
                                            {getIcon(event.type)}
                                        </div>
                                        <span className={clsx(
                                            "text-xs font-bold uppercase tracking-wider",
                                            isImportant ? "text-white" : "text-slate-700 dark:text-slate-300"
                                        )}>
                                            {event.typeName.replace(/_/g, ' ')}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    {event.data?.description && (
                                        <p className={clsx(
                                            "text-sm leading-relaxed",
                                            isImportant ? "text-white" : "text-slate-800 dark:text-slate-200"
                                        )}>
                                            {event.data.description}
                                        </p>
                                    )}

                                    {/* Player Name */}
                                    {event.data?.playerName && (
                                        <div className="mt-2">
                                            <span className={clsx(
                                                "text-xs font-semibold",
                                                isImportant ? "text-white/90" : "text-emerald-700 dark:text-emerald-400"
                                            )}>
                                                👤 {event.data.playerName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
