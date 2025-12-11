'use client';

import { useState } from 'react';
import { Match } from '@/lib/api';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

interface FixturesListProps {
    matches: Match[];
}

export default function FixturesList({ matches }: FixturesListProps) {
    const [currentWeek, setCurrentWeek] = useState(1);
    const totalWeeks = 14; // Fixed for now based on seed

    const filteredMatches = matches.filter(m => m.week === currentWeek);

    const nextWeek = () => setCurrentWeek(prev => Math.min(prev + 1, totalWeeks));
    const prevWeek = () => setCurrentWeek(prev => Math.max(prev - 1, 1));

    return (
        <div className="rounded-2xl border transition-all duration-300 overflow-hidden h-full
            bg-white border-emerald-500/40 shadow-none
            dark:bg-black/40 dark:border-emerald-900/50 dark:backdrop-blur-sm dark:shadow-[0_0_20px_rgba(2,44,34,0.3)]">
            <div className="px-6 h-[72px] border-b flex items-center justify-between
                bg-white border-emerald-500/40
                dark:bg-emerald-950/20 dark:border-emerald-900/50">
                <h3 className="text-lg font-bold tracking-wider uppercase flex items-center gap-2
                    text-emerald-900 dark:text-white">
                    <span className="text-emerald-500">📅</span> Fixtures
                </h3>

                <div className="flex items-center gap-4 rounded-lg p-1 border
                    bg-emerald-50 border-emerald-200
                    dark:bg-black/60 dark:border-emerald-900/50">
                    <button
                        onClick={prevWeek}
                        disabled={currentWeek === 1}
                        className="p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors
                            text-emerald-600 hover:bg-emerald-200 hover:text-emerald-900
                            dark:text-emerald-500 dark:hover:bg-emerald-900/30 dark:hover:text-white"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm font-bold min-w-[5rem] text-center tracking-widest
                        text-emerald-800 dark:text-emerald-100">
                        WEEK {currentWeek.toString().padStart(2, '0')}
                    </span>
                    <button
                        onClick={nextWeek}
                        disabled={currentWeek === totalWeeks}
                        className="p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors
                            text-emerald-600 hover:bg-emerald-200 hover:text-emerald-900
                            dark:text-emerald-500 dark:hover:bg-emerald-900/30 dark:hover:text-white"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="divide-y max-h-[600px] overflow-y-auto
                divide-emerald-100 dark:divide-emerald-900/30">
                {filteredMatches.length === 0 ? (
                    <div className="p-8 text-center text-emerald-700/50 italic">
                        No matches scheduled for this week.
                    </div>
                ) : (
                    filteredMatches.map((match) => (
                        <div key={match.id} className="p-4 transition-colors group border-l-2 border-transparent
                            hover:bg-emerald-50 dark:hover:bg-emerald-900/10">
                            <div className="flex items-center justify-between text-sm mb-3">
                                <div className="flex items-center gap-2 text-slate-500 dark:text-emerald-600/70">
                                    <Clock size={14} />
                                    <span className="font-mono text-xs">{new Date(match.scheduledAt).toLocaleString('en-GB', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>

                            </div>

                            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                                <div className="flex items-center gap-3 text-right justify-end">
                                    <span className="font-bold text-base transition-colors text-emerald-900 hover:text-emerald-700 dark:text-white dark:hover:text-emerald-300">
                                        <Link href={`/teams/${match.homeTeamId}`} className="hover:underline decoration-emerald-500/50">
                                            {match.homeTeam?.name || 'Home Team'}
                                        </Link>
                                    </span>
                                </div>

                                <div className="px-4 py-1.5 rounded-lg border font-mono font-black text-lg min-w-[80px] text-center transition-all
                                    bg-emerald-50 border-emerald-200 text-emerald-800 shadow-none
                                    dark:bg-black/60 dark:border-emerald-900/50 dark:text-emerald-400 dark:shadow-inner dark:shadow-emerald-950">
                                    {match.status === 'scheduled' ? 'vs' : `${match.homeScore} - ${match.awayScore}`}
                                </div>

                                <div className="flex items-center gap-3 text-left justify-start">
                                    <span className="font-bold text-base transition-colors text-emerald-900 hover:text-emerald-700 dark:text-white dark:hover:text-emerald-300">
                                        <Link href={`/teams/${match.awayTeamId}`} className="hover:underline decoration-emerald-500/50">
                                            {match.awayTeam?.name || 'Away Team'}
                                        </Link>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
