'use client';

import React, { useState } from 'react';
import { TacticsEditor } from '@/components/tactics/TacticsEditor';
import { Player } from '@/lib/api';
import Link from 'next/link';

interface TacticsContentProps {
    match: any;
    teamId: string;
    players: Player[];
    tactics: any;
}

export function TacticsContent({ match, teamId, players, tactics }: TacticsContentProps) {
    const [lineupInfo, setLineupInfo] = useState({ formation: '0-0-0', playerCount: 0 });

    const team = match.homeTeamId === teamId ? match.homeTeam : match.awayTeam;
    const opponent = match.homeTeamId === teamId ? match.awayTeam : match.homeTeam;

    return (
        <div className="min-h-screen font-mono">
            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href={`/league/${match.leagueId}`}
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        <span className="font-bold tracking-wider">BACK TO LEAGUE</span>
                    </Link>
                </div>

                {/* Match Info Header */}
                <div className="mb-8 p-6 rounded-2xl border-2 bg-white border-emerald-500/40 shadow-none dark:bg-emerald-950/20 dark:border-emerald-500/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-emerald-900 dark:text-white mb-2">
                                Set Tactics: {team?.name}
                            </h1>
                            <p className="text-sm text-slate-600 dark:text-emerald-400">
                                vs {opponent?.name} • {new Date(match.scheduledAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Formation</span>
                                    <span className="text-lg font-black text-emerald-800 dark:text-emerald-300">{lineupInfo.formation}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Players</span>
                                    <span className={`text-lg font-black ${lineupInfo.playerCount >= 11 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                        {lineupInfo.playerCount} / 11
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-slate-500 dark:text-emerald-600 uppercase tracking-wider mb-1">
                                    Week {match.week}
                                </div>
                                <div className="text-sm font-bold text-emerald-900 dark:text-emerald-400">
                                    {match.status.replace('_', ' ').toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tactics Editor */}
                <TacticsEditor
                    matchId={match.id}
                    teamId={teamId}
                    players={players}
                    initialTactics={tactics}
                    matchScheduledAt={match.scheduledAt}
                    matchStatus={match.status}
                    onLineupChange={(formation, playerCount) => setLineupInfo({ formation, playerCount })}
                />
            </div>
        </div>
    );
}
