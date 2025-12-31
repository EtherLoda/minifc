
import React from 'react';
import { Match } from '@/lib/api';
import { clsx } from 'clsx';

interface MatchHeaderProps {
    match: Match;
    currentScore?: { home: number; away: number };
}

export function MatchHeader({ match, currentScore }: MatchHeaderProps) {
    const isLive = match.status === 'in_progress';
    const isCompleted = match.status === 'completed';

    // Use currentScore from events if available (for live/in-progress matches),
    // otherwise fall back to match.homeScore/awayScore (for completed matches)
    const displayHomeScore = currentScore?.home ?? match.homeScore ?? 0;
    const displayAwayScore = currentScore?.away ?? match.awayScore ?? 0;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 overflow-hidden shadow-xl relative">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-white to-emerald-400/5 dark:from-emerald-500/10 dark:via-emerald-950/20 dark:to-emerald-600/10"></div>
            
            <div className="relative p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Home Team */}
                    <div className="flex flex-col items-center flex-1">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-emerald-900/40 dark:to-emerald-950/60 flex items-center justify-center mb-3 shadow-lg border-2 border-emerald-500/20">
                            {match.homeTeam?.logoUrl ? (
                                <img src={match.homeTeam.logoUrl} alt={match.homeTeam.name} className="w-20 h-20 object-contain" />
                            ) : (
                                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                    {match.homeTeam?.name?.substring(0, 2).toUpperCase() ?? 'HM'}
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl font-black text-emerald-900 dark:text-emerald-300 text-center uppercase tracking-wide">
                            {match.homeTeam?.name ?? 'Home Team'}
                        </h2>
                    </div>

                    {/* Center - Score / Time */}
                    <div className="flex flex-col items-center min-w-[200px]">
                        {isLive && (
                            <div className="flex items-center gap-2 mb-3">
                                <div className="relative w-10 h-10 flex items-center justify-center">
                                    <div className="absolute w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <div className="absolute w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                                </div>
                                <span className="text-sm font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                                    LIVE
                                </span>
                            </div>
                        )}
                        {(isCompleted || isLive) ? (
                            <div className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-white dark:bg-emerald-950/60 shadow-lg border-2 border-emerald-500/30">
                                <div className="text-6xl font-black text-emerald-900 dark:text-emerald-300 tabular-nums">
                                    {displayHomeScore}
                                </div>
                                <div className="text-3xl font-bold text-slate-400 dark:text-slate-600">-</div>
                                <div className="text-6xl font-black text-emerald-900 dark:text-emerald-300 tabular-nums">
                                    {displayAwayScore}
                                </div>
                            </div>
                        ) : (
                            <div className="text-4xl font-black text-slate-400 dark:text-slate-600 px-8 py-4 rounded-2xl bg-white/60 dark:bg-emerald-950/40">
                                VS
                            </div>
                        )}

                        <div className="mt-3 text-slate-600 dark:text-emerald-400 text-sm font-semibold">
                            {isCompleted ? 'Full Time' : formatDate(match.scheduledAt)}
                        </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex flex-col items-center flex-1">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-white to-slate-50 dark:from-emerald-900/40 dark:to-emerald-950/60 flex items-center justify-center mb-3 shadow-lg border-2 border-emerald-500/20">
                            {match.awayTeam?.logoUrl ? (
                                <img src={match.awayTeam.logoUrl} alt={match.awayTeam.name} className="w-20 h-20 object-contain" />
                            ) : (
                                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                    {match.awayTeam?.name?.substring(0, 2).toUpperCase() ?? 'AW'}
                                </span>
                            )}
                        </div>
                        <h2 className="text-2xl font-black text-emerald-900 dark:text-emerald-300 text-center uppercase tracking-wide">
                            {match.awayTeam?.name ?? 'Away Team'}
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
