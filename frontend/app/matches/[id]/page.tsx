import React from 'react';
import { api } from '@/lib/api';
import { MatchHeader } from '@/components/match/MatchHeader';
import { MatchEvents } from '@/components/match/MatchEvents';
import { MatchStats } from '@/components/match/MatchStats';
import Link from 'next/link';

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Data
    const match = await api.getMatch(id);
    const eventsData = await api.getMatchEvents(id);

    // Stats might not exist if match is not started/completed, handle gracefully
    let stats = null;
    try {
        stats = await api.getMatchStats(id);
    } catch (e) {
        // Ignore error if stats not found (e.g. match scheduled)
    }

    return (
        <div className="min-h-screen bg-black font-mono">
            {/* Cyber Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#022c22_1px,transparent_1px),linear-gradient(to_bottom,#022c22_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50"></div>

                {/* Animated orbs */}
                <div className="absolute top-[-10%] left-[10%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[100px]"></div>
                <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-teal-900/10 blur-[80px]"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href={`/league/${match.leagueId}`}
                        className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        <span className="font-bold tracking-wider">BACK TO LEAGUE</span>
                    </Link>
                </div>

                {/* Match Header - Cyberpunk Style */}
                <div className="mb-12">
                    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-8 backdrop-blur-md shadow-[0_0_30px_rgba(2,44,34,0.3)]">
                        {/* Background effects */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="relative z-10">
                            {/* Status Badge */}
                            <div className="flex items-center justify-center gap-3 mb-6 text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Match Center
                            </div>

                            {/* Teams Display */}
                            <div className="flex items-center justify-center gap-8 mb-8">
                                {/* Home Team */}
                                <div className="flex-1 flex flex-col items-end">
                                    <div className="text-right mb-3">
                                        <div className="text-3xl md:text-4xl font-black text-white mb-1">
                                            {match.homeTeam?.name || 'Home'}
                                        </div>
                                        <div className="text-xs text-emerald-600 font-bold tracking-widest uppercase">Home</div>
                                    </div>
                                    {/* Score */}
                                    <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                                        {match.homeScore ?? 0}
                                    </div>
                                </div>

                                {/* VS Divider */}
                                <div className="flex flex-col items-center">
                                    <div className="w-px h-20 bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent mb-4"></div>
                                    <div className="px-6 py-3 rounded-xl bg-black/60 border-2 border-emerald-500/30 backdrop-blur-sm">
                                        <span className="text-emerald-400 font-black text-xl tracking-wider">VS</span>
                                    </div>
                                    <div className="w-px h-20 bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent mt-4"></div>
                                </div>

                                {/* Away Team */}
                                <div className="flex-1 flex flex-col items-start">
                                    <div className="text-left mb-3">
                                        <div className="text-3xl md:text-4xl font-black text-white mb-1">
                                            {match.awayTeam?.name || 'Away'}
                                        </div>
                                        <div className="text-xs text-emerald-600 font-bold tracking-widest uppercase">Away</div>
                                    </div>
                                    {/* Score */}
                                    <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-emerald-400 drop-shadow-[0_0_15px_rgba(163,230,53,0.5)]">
                                        {match.awayScore ?? 0}
                                    </div>
                                </div>
                            </div>

                            {/* Match Info */}
                            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                                <div className="px-4 py-2 rounded-lg bg-black/40 border border-emerald-500/20 text-emerald-400 font-mono">
                                    {new Date(match.scheduledAt).toLocaleDateString()}
                                </div>
                                <div className="px-4 py-2 rounded-lg bg-black/40 border border-emerald-500/20 text-white font-mono">
                                    {new Date(match.scheduledAt).toLocaleTimeString()}
                                </div>
                                <div className={`px-4 py-2 rounded-lg border-2 font-bold uppercase tracking-wider text-xs ${match.status === 'completed'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : match.status === 'in_progress'
                                        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 animate-pulse'
                                        : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                                    }`}>
                                    {match.status.replace('_', ' ')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Match Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Events Column */}
                    <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md">
                        <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 p-6">
                            <h2 className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-400 mb-6">
                                Match Events
                            </h2>
                            <MatchEvents
                                events={eventsData.events}
                                homeTeamId={match.homeTeamId}
                                awayTeamId={match.awayTeamId}
                            />
                        </div>
                    </div>

                    {/* Stats Column */}
                    <div>
                        {stats ? (
                            <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
                                <div className="relative z-10 p-6">
                                    <h2 className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-400 mb-6">
                                        Match Statistics
                                    </h2>
                                    <MatchStats
                                        stats={stats}
                                        homeTeamName={match.homeTeam?.name ?? 'Home'}
                                        awayTeamName={match.awayTeam?.name ?? 'Away'}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="relative overflow-hidden rounded-xl border border-slate-500/20 bg-slate-950/20 backdrop-blur-md p-12 text-center">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 to-transparent"></div>
                                <div className="relative z-10">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
                                        <span className="text-3xl">📊</span>
                                    </div>
                                    <p className="text-emerald-600 font-mono text-sm tracking-wider uppercase">
                                        [ Statistics Available After Kick-off ]
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
