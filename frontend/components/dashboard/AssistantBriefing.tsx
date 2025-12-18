'use client';

import { MiniPlayer } from '@/components/MiniPlayer';
import { generateAppearance } from '@/utils/playerUtils';
import { ArrowRight, TrendingUp, Calendar, AlertCircle, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';

export default function AssistantBriefing() {
    const { user } = useAuth();
    // Assistant Appearance - Consistent seed
    const assistantAppearance = generateAppearance('assistant-manager-xv2');

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header: Assistant Speaking */}
            <div className="flex flex-col md:flex-row items-start gap-6 bg-white dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-500/20 relative overflow-hidden">
                {/* Visual */}
                <div className="shrink-0 relative z-10 mx-auto md:mx-0">
                    <div className="w-32 h-32 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center border-2 border-emerald-500/30">
                        <MiniPlayer appearance={assistantAppearance} position="MID" size={100} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white dark:border-black uppercase tracking-wider">
                        Assistant
                    </div>
                </div>

                {/* Speech Bubble */}
                <div className="flex-1 relative z-10 text-center md:text-left">
                    <h2 className="text-2xl font-black italic text-slate-900 dark:text-white mb-2">
                        Morning, Boss.
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-emerald-100/80 leading-relaxed font-medium">
                        "The squad is looking sharp in training. <strong className="text-emerald-600 dark:text-emerald-400">Marcus Rashford</strong> has really improved his finishing this week. I've prepared a brief on our upcoming fixture against Arsenal."
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                        <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold flex items-center gap-1">
                            <TrendingUp size={12} /> Player Upgrades
                        </div>
                        <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 text-xs font-bold flex items-center gap-1">
                            <AlertCircle size={12} /> Contract Expiring
                        </div>
                    </div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Card 1: Player Development */}
                <div className="bg-white dark:bg-black/40 border border-emerald-900/20 rounded-xl p-5 hover:border-emerald-500/30 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold uppercase text-xs tracking-wider">
                            <TrendingUp size={16} /> Development
                        </div>
                        <span className="text-xs text-slate-500">This Week</span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">MR</div>
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">Marcus Rashford</div>
                                <div className="text-xs text-emerald-500 font-bold">Finishing +1 (88)</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">AG</div>
                            <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">Alejandro Garnacho</div>
                                <div className="text-xs text-emerald-500 font-bold">Pace +1 (92)</div>
                            </div>
                        </div>
                    </div>

                    <Link href="/training" className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-emerald-500 transition-colors">
                        View Training Report <ArrowRight size={12} />
                    </Link>
                </div>

                {/* Card 2: Next Match */}
                <div className="bg-white dark:bg-black/40 border border-emerald-900/20 rounded-xl p-5 hover:border-emerald-500/30 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase text-xs tracking-wider">
                            <Calendar size={16} /> Next Match
                        </div>
                        <span className="text-xs text-slate-500">Saturday 15:00</span>
                    </div>

                    <div className="text-center py-2">
                        <div className="text-xs font-bold text-slate-500 mb-1">Premier League - Week 15</div>
                        <div className="flex items-center justify-center gap-4">
                            <div className="font-black text-xl text-slate-900 dark:text-white">MUN</div>
                            <div className="px-2 py-1 bg-slate-100 dark:bg-white/10 rounded text-xs font-mono font-bold">VS</div>
                            <div className="font-black text-xl text-slate-900 dark:text-white">ARS</div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">Old Trafford</p>
                    </div>

                    <Link href="/matches" className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-emerald-500 transition-colors">
                        View Match Preview <ArrowRight size={12} />
                    </Link>
                </div>

                {/* Card 3: Finance / Inbox */}
                <div className="bg-white dark:bg-black/40 border border-emerald-900/20 rounded-xl p-5 hover:border-emerald-500/30 transition-colors group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold uppercase text-xs tracking-wider">
                            <DollarSign size={16} /> Finance
                        </div>
                        <span className="text-xs text-slate-500">Today</span>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Weekly wages of <strong className="text-slate-900 dark:text-white">£3,450,000</strong> have been processed.
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Scout Report: <strong className="text-slate-900 dark:text-white">Brazil Trip</strong> completed.
                        </p>
                    </div>

                    <Link href="/club/finance" className="mt-4 flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-emerald-500 transition-colors">
                        View Financials <ArrowRight size={12} />
                    </Link>
                </div>

            </div>
        </div>
    );
}
