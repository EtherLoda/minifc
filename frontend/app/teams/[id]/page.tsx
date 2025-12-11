import React from 'react';
import { api } from '@/lib/api';
import { TeamHeader } from '@/components/team/TeamHeader';
import { RosterTable } from '@/components/team/RosterTable';
import Link from 'next/link';

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Fetch Data
    const team = await api.getTeam(id);
    const playersRes = await api.getPlayers(id);
    const players = playersRes.data;

    return (
        <div className="min-h-screen bg-black font-mono">
            {/* Cyber Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Grid Floor */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#022c22_1px,transparent_1px),linear-gradient(to_bottom,#022c22_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50"></div>

                {/* Glowing orbs */}
                <div className="absolute top-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-900/10 blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] rounded-full bg-emerald-900/10 blur-[100px]"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-6">
                    <Link
                        href="/league/123"
                        className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        <span className="font-bold tracking-wider">BACK TO LEAGUE</span>
                    </Link>
                </div>

                {/* Team Header - Cyberpunk Style */}
                <div className="mb-12">
                    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-8 backdrop-blur-md shadow-[0_0_30px_rgba(2,44,34,0.3)]">
                        {/* Background effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                {/* Team Logo */}
                                <div className="w-24 h-24 rounded-xl bg-black/40 border-2 border-emerald-500/30 flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                                    {team.logoUrl ? (
                                        <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-4xl font-black text-emerald-400">{team.name.charAt(0)}</span>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center gap-3 mb-2 text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        Active Squad
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
                                        {team.name}
                                    </h1>
                                </div>
                            </div>

                            {/* Squad Size Badge */}
                            <div className="px-6 py-3 rounded-xl bg-black/40 border-2 border-emerald-500/30 backdrop-blur-sm">
                                <div className="text-[10px] text-emerald-600 font-bold tracking-widest uppercase mb-1">Squad Size</div>
                                <div className="text-3xl font-black text-white">{players.length}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <RosterTable players={players} />

                        {/* Schedule Placeholder */}
                        <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-6 backdrop-blur-md">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
                            <h2 className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-400 mb-4">
                                Season Schedule
                            </h2>
                            <p className="text-emerald-600 text-center py-8 font-mono text-sm tracking-wider">
                                [ SCHEDULE MODULE LOADING... ]
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Club Info */}
                        <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-6 backdrop-blur-md">
                            <h2 className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-400 mb-6">
                                Club Info
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-emerald-900/30 pb-3">
                                    <span className="text-emerald-600 text-sm font-bold tracking-wider uppercase">Founded</span>
                                    <span className="text-white font-mono text-lg">2024</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-emerald-900/30 pb-3">
                                    <span className="text-emerald-600 text-sm font-bold tracking-wider uppercase">Stadium</span>
                                    <span className="text-white font-mono text-lg">GoalXI Stadium</span>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-emerald-600 text-sm font-bold tracking-wider uppercase">Players</span>
                                    <span className="text-emerald-400 font-mono text-2xl font-black">{players.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Team Stats Placeholder */}
                        <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-6 backdrop-blur-md">
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                            <h2 className="text-xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-400 mb-6">
                                Season Stats
                            </h2>
                            <div className="space-y-3 relative z-10">
                                <div className="flex justify-between items-center">
                                    <span className="text-emerald-600 text-xs font-bold tracking-wider uppercase">Matches</span>
                                    <span className="text-white font-mono text-xl">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-emerald-600 text-xs font-bold tracking-wider uppercase">Wins</span>
                                    <span className="text-emerald-400 font-mono text-xl font-bold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-emerald-600 text-xs font-bold tracking-wider uppercase">Goals</span>
                                    <span className="text-white font-mono text-xl">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
