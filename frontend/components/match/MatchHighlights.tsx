'use client';

import React from 'react';
import { MatchEvent } from '@/lib/api';
import { Goal, ArrowLeftRight, Square, Users, MoveRight } from 'lucide-react';

interface MatchHighlightsProps {
    events: MatchEvent[];
    homeTeamName: string;
    awayTeamName: string;
}

interface HighlightEvent {
    minute: number;
    type: 'goal' | 'yellow_card' | 'red_card' | 'substitution' | 'position_change';
    teamSide: 'home' | 'away';
    description: string;
    playerName?: string;
    data?: any;
}

const getEventIcon = (type: string) => {
    switch (type) {
        case 'goal':
            return <Goal className="w-4 h-4" />;
        case 'yellow_card':
            return <Square className="w-3 h-4" />;
        case 'red_card':
            return <Square className="w-3 h-4" />;
        case 'substitution':
            return <ArrowLeftRight className="w-4 h-4" />;
        case 'position_change':
            return <MoveRight className="w-4 h-4" />;
        default:
            return null;
    }
};

const getEventColor = (type: string) => {
    switch (type) {
        case 'goal':
            return 'bg-green-500 text-white border-green-600';
        case 'yellow_card':
            return 'bg-yellow-400 text-black border-yellow-500';
        case 'red_card':
            return 'bg-red-500 text-white border-red-600';
        case 'substitution':
            return 'bg-blue-500 text-white border-blue-600';
        case 'position_change':
            return 'bg-purple-500 text-white border-purple-600';
        default:
            return 'bg-slate-500 text-white border-slate-600';
    }
};

export function MatchHighlights({ events, homeTeamName, awayTeamName }: MatchHighlightsProps) {
    // Filter and transform events into highlights
    const highlights: HighlightEvent[] = React.useMemo(() => {
        const highlightEvents: HighlightEvent[] = [];

        events.forEach(event => {
            const eventType = typeof event.type === 'string' ? event.type.toLowerCase() : '';
            const eventTypeName = typeof event.typeName === 'string' ? event.typeName.toLowerCase() : '';
            const combinedType = `${eventType}_${eventTypeName}`;

            let highlightType: HighlightEvent['type'] | null = null;
            let teamSide: 'home' | 'away' = 'home';

            // Determine event type and team
            if (eventType === 'goal' || eventTypeName === 'goal') {
                highlightType = 'goal';
                teamSide = event.data?.teamName === homeTeamName ? 'home' : 'away';
            } else if (eventType === 'yellow_card' || eventTypeName === 'yellow_card') {
                highlightType = 'yellow_card';
                teamSide = event.data?.teamName === homeTeamName ? 'home' : 'away';
            } else if (eventType === 'red_card' || eventTypeName === 'red_card') {
                highlightType = 'red_card';
                teamSide = event.data?.teamName === homeTeamName ? 'home' : 'away';
            } else if (eventType === 'substitution' || eventTypeName === 'substitution') {
                highlightType = 'substitution';
                teamSide = event.data?.teamName === homeTeamName ? 'home' : 'away';
            } else if (eventType === 'position_change' || eventTypeName === 'position_change') {
                highlightType = 'position_change';
                teamSide = event.data?.teamName === homeTeamName ? 'home' : 'away';
            }

            if (highlightType) {
                highlightEvents.push({
                    minute: event.minute,
                    type: highlightType,
                    teamSide,
                    description: event.description || '',
                    playerName: event.data?.playerName || '',
                    data: event.data
                });
            }
        });

        return highlightEvents.sort((a, b) => a.minute - b.minute);
    }, [events, homeTeamName, awayTeamName]);

    if (highlights.length === 0) {
        return (
            <div className="rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-white dark:bg-emerald-950/20 shadow-lg p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-4 text-center">
                    Match Highlights
                </h3>
                <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
                    No highlights yet
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-white dark:bg-emerald-950/20 shadow-lg overflow-hidden">
            <div className="p-5 border-b-2 border-emerald-500/40 dark:border-emerald-500/30 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/40 dark:via-emerald-900/20 dark:to-emerald-950/40">
                <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 text-center">
                    Match Highlights
                </h3>
            </div>

            <div className="p-6">
                <div className="space-y-3">
                    {highlights.map((highlight, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-md border-l-4"
                            style={{
                                backgroundColor: highlight.teamSide === 'home'
                                    ? 'rgba(110, 205, 234, 0.1)'
                                    : 'rgba(209, 94, 94, 0.1)',
                                borderLeftColor: highlight.teamSide === 'home' ? '#6ECDEA' : '#D15E5E'
                            }}
                        >
                            {/* Minute */}
                            <div className="min-w-[48px] text-center">
                                <span className="text-sm font-black text-slate-700 dark:text-slate-300 tabular-nums">
                                    {highlight.minute}'
                                </span>
                            </div>

                            {/* Icon */}
                            <div className={`flex items-center justify-center w-8 h-8 rounded-md shadow-sm border-2 ${getEventColor(highlight.type)}`}>
                                {getEventIcon(highlight.type)}
                            </div>

                            {/* Team Badge (Optional visual indicator) */}
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: highlight.teamSide === 'home' ? '#6ECDEA' : '#D15E5E'
                                }}
                            />

                            {/* Description */}
                            <div className="flex-1">
                                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                    {highlight.teamSide === 'home' ? homeTeamName : awayTeamName}
                                </div>
                                <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                    {highlight.description}
                                </div>
                            </div>

                            {/* Type Label */}
                            <div className="hidden sm:block">
                                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded ${getEventColor(highlight.type)}`}>
                                    {highlight.type.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
