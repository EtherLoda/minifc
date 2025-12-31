import React, { Suspense } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { MiniPlayer } from '@/components/MiniPlayer';
import { LoadingSpinner, LoadingOverlay } from '@/components/ui/LoadingSpinner';
import { SkeletonCard } from '@/components/ui/SkeletonLoader';
import { PotentialBadge, PotentialStars } from '@/components/ui/PotentialBadge';
import { AbilityStars } from '@/components/ui/AbilityStars';
import { SkillBars } from '@/components/ui/SkillBars';
import { PlayerAuctionInfo } from '@/components/player/PlayerAuctionInfo';
import { convertAppearance, generateAppearance } from '@/utils/playerUtils';

async function PlayerData({ id }: { id: string }) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/cda15cfd-2b2c-4a7c-8f03-3a70d4e1a536',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/players/[id]/page.tsx:12',message:'PlayerData function entry',data:{playerId:id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const player = await api.getPlayer(id);
    const team = await api.getTeam(player.teamId);

    const getSkillColor = (val: number) => {
        if (val >= 16) return 'text-emerald-600 dark:text-emerald-400 font-bold';
        if (val >= 12) return 'text-emerald-500 dark:text-emerald-300';
        if (val >= 8) return 'text-amber-500 dark:text-yellow-400';
        return 'text-slate-500 dark:text-slate-400';
    };

    const getSkillBarColor = (val: number) => {
        if (val >= 16) return 'from-emerald-500 to-green-500';
        if (val >= 12) return 'from-emerald-600 to-green-600';
        if (val >= 8) return 'from-yellow-500 to-orange-500';
        return 'from-slate-600 to-slate-700';
    };

    // Get player appearance from data or generate fallback
    const playerAppearance = convertAppearance(player.appearance) || generateAppearance(player.id);

    const renderAttributes = (skills: any) => {
        if (!skills) return null;

        const categories = [
            {
                key: 'physical',
                label: 'Physical',
                icon: '⚡',
                color: 'emerald',
                bgColor: 'bg-white dark:bg-emerald-950/30',
                borderColor: 'border-emerald-500/40 dark:border-emerald-500/20'
            },
            {
                key: 'technical',
                label: 'Technical',
                icon: '⚽',
                color: 'blue',
                bgColor: 'bg-white dark:bg-blue-950/30',
                borderColor: 'border-blue-500/40 dark:border-blue-500/20'
            },
            {
                key: 'mental',
                label: 'Mental',
                icon: '🧠',
                color: 'purple',
                bgColor: 'bg-white dark:bg-purple-950/30',
                borderColor: 'border-purple-500/40 dark:border-purple-500/20'
            }
        ];

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map(cat => {
                    const group = skills[cat.key] || {};
                    const textColor = cat.color === 'emerald' ? 'text-emerald-500' :
                        cat.color === 'blue' ? 'text-blue-500' : 'text-purple-400';

                    return (
                        <div key={cat.key} className={`rounded-xl ${cat.bgColor} border-2 ${cat.borderColor} p-6 backdrop-blur-sm`}>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-3xl">{cat.icon}</span>
                                <h3 className={`text-lg font-black italic uppercase ${textColor} tracking-wider`}>
                                    {cat.label}
                                </h3>
                            </div>
                            <div className="space-y-3">
                                {Object.entries(group).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-3">
                                        {/* Skill name */}
                                        <span className={`text-xs ${textColor} font-bold tracking-wider uppercase w-20 shrink-0`}>
                                            {key}
                                        </span>

                                        {/* Skill bar */}
                                        <div className="flex-1 h-3 bg-black/60 rounded-full overflow-hidden border border-emerald-900/30 relative">
                                            {/* Potential bar (background) */}
                                            {player.potentialSkills?.[cat.key]?.[key] && (
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-r from-slate-600/30 to-slate-500/30"
                                                    style={{ width: `${((player.potentialSkills[cat.key][key] as number) / 20) * 100}%` }}
                                                />
                                            )}
                                            {/* Current skill bar (foreground) */}
                                            <div
                                                className={`relative h-full bg-gradient-to-r ${getSkillBarColor(value as number)} transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]`}
                                                style={{ width: `${((value as number) / 20) * 100}%` }}
                                            />
                                        </div>

                                        {/* Skill value */}
                                        <span className={`font-black text-xl ${getSkillColor(value as number)} w-10 text-right shrink-0 tabular-nums`}>
                                            {String(value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen font-mono">
            {/* Background is handled globally by layout.tsx */}

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href={`/teams/${player.teamId}`}
                        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        <span className="font-bold tracking-wider">BACK TO {team.name.toUpperCase()}</span>
                    </Link>
                </div>

                {/* Player Card */}
                <div className="mb-12">
                    <div className="relative overflow-hidden rounded-2xl border-2 transition-all duration-300
                        bg-white border-emerald-500/40 shadow-none
                        dark:border-emerald-500/20 dark:bg-black/40 dark:backdrop-blur-md dark:shadow-[0_0_40px_rgba(16,185,129,0.2)]
                        p-4 sm:p-6 md:p-8">
                        {/* Background effects */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="hidden dark:block absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[size:100%_4px] pointer-events-none rounded-2xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
                            {/* Left: Avatar */}
                            <div className="flex flex-col items-center gap-6 shrink-0">
                                {/* Player Avatar */}
                                <div className="relative">
                                    {/* Hologram base */}
                                    <div className="dark:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900/10 blur-xl rounded-full"></div>
                                    <div className="hidden dark:block absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-10 bg-emerald-500/30 blur-2xl rounded-full"></div>

                                    <div className="relative z-10 filter drop-shadow-xl dark:drop-shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-125">
                                        <MiniPlayer
                                            appearance={playerAppearance}
                                            size={160}
                                        />
                                    </div>
                                </div>

                                {/* Team Badge */}
                                <div className="px-6 py-3 rounded-xl bg-white dark:bg-black/60 border-2 border-emerald-500/40 dark:border-emerald-500/30 backdrop-blur-sm shadow-none">
                                    <div className="text-[10px] text-slate-500 dark:text-emerald-600 font-bold tracking-widest uppercase mb-1 text-center">Team</div>
                                    <div className="text-lg font-black text-slate-900 dark:text-white text-center">{team.name}</div>
                                </div>
                            </div>

                            {/* Right: Info */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-4 text-xs font-bold tracking-[0.2em] uppercase text-slate-500 dark:text-emerald-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Player Profile
                                </div>

                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r 
                                    from-emerald-600 via-emerald-500 to-emerald-700
                                    dark:from-white dark:via-emerald-200 dark:to-emerald-400 dark:drop-shadow-[0_0_15px_rgba(16,185,129,0.4)] mb-3 md:mb-4">
                                    {player.name}
                                </h1>

                                {/* Ability Stars */}
                                <div className="flex justify-center md:justify-start mb-4 md:mb-6">
                                    <AbilityStars currentSkills={player.currentSkills} isGoalkeeper={player.isGoalkeeper} size="lg" />
                                </div>

                                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start mb-6 md:mb-8">
                                    <span className="text-lg font-mono font-bold px-4 py-2 rounded-lg border 
                                        bg-slate-50 border-slate-200 text-slate-600
                                        dark:bg-black/40 dark:border-emerald-500/30 dark:text-emerald-600">
                                        AGE {player.age}, DAY {player.ageDays}
                                    </span>
                                    {player.potentialTier && (
                                        <PotentialBadge tier={player.potentialTier as any} size="lg" />
                                    )}
                                    {player.isYouth && (
                                        <span className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 border-2 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/30 font-bold text-sm animate-pulse">
                                            YOUTH ACADEMY
                                        </span>
                                    )}
                                </div>

                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                    <div className="rounded-xl p-4 border-2 backdrop-blur-sm
                                        bg-white border-emerald-500/40
                                        dark:bg-black/60 dark:border-amber-500/30">
                                        <div className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase mb-2">Stamina</div>
                                        <div className="text-4xl font-black text-emerald-700 dark:text-amber-500">{Math.floor(player.stamina)}</div>
                                    </div>
                                    <div className="rounded-xl p-4 border-2 backdrop-blur-sm
                                        bg-white border-emerald-500/40
                                        dark:bg-black/60 dark:border-emerald-500/30">
                                        <div className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase mb-2">Form</div>
                                        <div className="text-4xl font-black text-emerald-700 dark:text-emerald-400">{Math.floor(player.form)}</div>
                                    </div>
                                    <div className="rounded-xl p-4 border-2 backdrop-blur-sm
                                        bg-white border-emerald-500/40
                                        dark:bg-black/60 dark:border-purple-500/30">
                                        <div className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase mb-2">Potential</div>
                                        <div className="text-2xl font-black text-emerald-700 dark:text-purple-400">{player.potentialTier ?? 'N/A'}</div>
                                    </div>
                                    <div className="rounded-xl p-4 border-2 backdrop-blur-sm
                                        bg-white border-emerald-500/40
                                        dark:bg-black/60 dark:border-blue-500/30">
                                        <div className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase mb-2">Experience</div>
                                        <div className="text-2xl font-black text-emerald-700 dark:text-blue-400">{player.experience ?? 0}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attributes Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                        <h2 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400 tracking-tight">
                            Player Attributes
                        </h2>
                    </div>
                    <SkillBars 
                        currentSkills={player.currentSkills} 
                        potentialSkills={player.potentialSkills}
                        isGoalkeeper={player.isGoalkeeper}
                    />
                </div>

                {/* Transfer Market Info - Client Component */}
                <PlayerAuctionInfo playerId={id} />

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Career Stats */}
                    <div className="relative overflow-hidden rounded-xl border-2 border-emerald-500/20 bg-black/40 backdrop-blur-md p-6">
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400 mb-6">
                                Career Statistics
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-emerald-900/30 pb-3">
                                    <span className="text-emerald-500 text-sm font-bold tracking-wider uppercase">Matches Played</span>
                                    <span className="text-white font-mono text-2xl font-black">0</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-emerald-900/30 pb-3">
                                    <span className="text-emerald-500 text-sm font-bold tracking-wider uppercase">Goals</span>
                                    <span className="text-emerald-400 font-mono text-2xl font-black">0</span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-emerald-500 text-sm font-bold tracking-wider uppercase">Assists</span>
                                    <span className="text-white font-mono text-2xl font-black">0</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Player Status */}
                    <div className="relative overflow-hidden rounded-xl border-2 border-blue-500/20 bg-black/40 backdrop-blur-md p-6">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                        <div className="relative z-10">
                            <h3 className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-6">
                                Player Status
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-emerald-900/30 pb-3">
                                    <span className="text-blue-500 text-sm font-bold tracking-wider uppercase">Contract</span>
                                    <span className="text-white font-mono text-lg">Active</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-emerald-900/30 pb-3">
                                    <span className="text-blue-500 text-sm font-bold tracking-wider uppercase">Transfer Status</span>
                                    <span className={`font-mono text-lg ${player.onTransfer ? 'text-red-400 font-bold' : 'text-white'}`}>
                                        {player.onTransfer ? 'LISTED' : 'Not Listed'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-blue-500 text-sm font-bold tracking-wider uppercase">Condition</span>
                                    <span className="text-emerald-400 font-mono text-lg font-bold">Fit</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PlayerLoadingSkeleton() {
    return (
        <div className="min-h-screen bg-black font-mono">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50"></div>
                <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-emerald-900/10 blur-[120px] animate-pulse"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <div className="mb-6">
                    <div className="h-4 w-48 bg-emerald-950/40 rounded animate-pulse"></div>
                </div>

                <div className="mb-12">
                    <SkeletonCard />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        </div>
    );
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    return (
        <Suspense fallback={<PlayerLoadingSkeleton />}>
            <PlayerData id={id} />
        </Suspense>
    );
}
