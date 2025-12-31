import React, { Suspense } from 'react';
import { api } from '@/lib/api';
import { TacticsEditor } from '@/components/tactics/TacticsEditor';
import { Skeleton } from '@/components/ui/SkeletonLoader';
import Link from 'next/link';

async function TacticsData({ id, teamId }: { id: string; teamId: string }) {
    const match = await api.getMatch(id);
    const players = await api.getPlayers(teamId);

    let tactics = null;
    try {
        const tacticsData = await api.getTactics(id);
        tactics = match.homeTeamId === teamId ? tacticsData.homeTactics : tacticsData.awayTactics;
    } catch (e) {
        // No tactics yet
    }

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

                {/* Tactics Editor */}
                <TacticsEditor
                    matchId={id}
                    teamId={teamId}
                    players={players.data}
                    initialTactics={tactics}
                    matchScheduledAt={match.scheduledAt}
                    matchStatus={match.status}
                />
            </div>
        </div>
    );
}

function TacticsLoadingSkeleton() {
    return (
        <div className="min-h-screen font-mono">
            <div className="relative z-10 container mx-auto px-4 py-8">
                <Skeleton className="h-4 w-32 mb-6" />
                <Skeleton className="h-32 w-full mb-8 rounded-2xl" />
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
                    <Skeleton className="h-[600px] rounded-2xl" />
                    <Skeleton className="h-[600px] rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

export default async function TacticsPage({ params }: { params: Promise<{ id: string; teamId: string }> }) {
    const { id, teamId } = await params;

    return (
        <Suspense fallback={<TacticsLoadingSkeleton />}>
            <TacticsData id={id} teamId={teamId} />
        </Suspense>
    );
}
