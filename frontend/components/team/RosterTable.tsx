import React from 'react';
import { Player } from '@/lib/api';
import { clsx } from 'clsx';
import Link from 'next/link';
import { MiniPlayer } from '@/components/MiniPlayer';
import { AbilityStars } from '@/components/ui/AbilityStars';

interface RosterTableProps {
    players: Player[];
}

export function RosterTable({ players }: RosterTableProps) {
    // Sort: Goalkeepers first, then by name
    const sortedPlayers = [...players].sort((a, b) => {
        if (a.isGoalkeeper && !b.isGoalkeeper) return -1;
        if (!a.isGoalkeeper && b.isGoalkeeper) return 1;
        return a.name.localeCompare(b.name);
    });

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

    const renderPlayerSkills = (player: Player) => {
        const skills = player.currentSkills;
        if (!skills) return null;

        const categories = [
            {
                key: 'physical',
                label: 'Physical',
                icon: '⚡',
                color: 'emerald',
                bgColor: 'bg-white/60 dark:bg-emerald-950/30',
                borderColor: 'border-slate-200 dark:border-emerald-500/20'
            },
            {
                key: 'technical',
                label: 'Technical',
                icon: '⚽',
                color: 'blue',
                bgColor: 'bg-white/60 dark:bg-blue-950/30',
                borderColor: 'border-slate-200 dark:border-blue-500/20'
            },
            {
                key: 'mental',
                label: 'Mental',
                icon: '🧠',
                color: 'purple',
                bgColor: 'bg-white/60 dark:bg-purple-950/30',
                borderColor: 'border-slate-200 dark:border-purple-500/20'
            }
        ];

        return (
            <div className="space-y-3">
                {categories.map(cat => {
                    const group = skills[cat.key] || {};
                    const textColor = cat.color === 'emerald' ? 'text-emerald-500' :
                        cat.color === 'blue' ? 'text-blue-500' : 'text-purple-400';

                    return (
                        <div key={cat.key} className={`rounded-lg ${cat.bgColor} border ${cat.borderColor} p-3`}>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">{cat.icon}</span>
                                <h4 className={`text-xs font-black italic uppercase ${textColor} tracking-wider`}>
                                    {cat.label}
                                </h4>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(group).map(([key, value]) => (
                                    <div key={key} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] ${textColor} font-bold tracking-wider uppercase`}>
                                                {key}
                                            </span>
                                            <span className={`font-mono text-sm ${getSkillColor(value as number)}`}>
                                                {value}
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-black/60 rounded-full overflow-hidden border border-emerald-900/30 relative">
                                            {/* Potential bar (background) */}
                                            {player.potentialSkills?.[cat.key]?.[key] && (
                                                <div
                                                    className="absolute inset-0 bg-gradient-to-r from-slate-600/30 to-slate-500/30"
                                                    style={{ width: `${((player.potentialSkills[cat.key][key] as number) / 20) * 100}%` }}
                                                />
                                            )}
                                            {/* Current skill bar (foreground) */}
                                            <div
                                                className={`relative h-full bg-gradient-to-r ${getSkillBarColor(value as number)} transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]`}
                                                style={{ width: `${((value as number) / 20) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Generate appearance for players (placeholder - you might want to store this in DB)
    const getPlayerAppearance = (index: number) => ({
        skinTone: ['#8d5524', '#c68642', '#e0ac69', '#f1c27d', '#ffdbac'][index % 5],
        hairColor: ['#000000', '#3b2414', '#8b4513', '#daa520', '#ff6347'][index % 5],
        hairStyle: ['short', 'mohawk', 'bald', 'long', 'curly'][index % 5] as any,
        jersey: {
            primary: '#10b981',
            secondary: '#ffffff',
            number: (index + 1).toString()
        }
    });

    return (
        <div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-emerald-950/20 backdrop-blur-md">
            {/* Background effect */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

            {/* Header */}
            <div className="relative z-10 p-6 border-b border-emerald-500/20">
                <h2 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                    Squad Roster
                </h2>
                <p className="text-emerald-600 text-sm font-mono tracking-wider uppercase mt-2">
                    {players.length} Players Active
                </p>
            </div>

            {/* Player Cards Grid */}
            <div className="relative z-10 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedPlayers.map((player, index) => (
                        <Link
                            key={player.id}
                            href={`/players/${player.id}`}
                            className="group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 p-4 md:p-6 backdrop-blur-sm
                                bg-white/80 border-slate-200 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1
                                dark:bg-black/40 dark:border-emerald-500/20 dark:hover:bg-emerald-500/5 dark:hover:border-emerald-400/40 dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                        >
                            {/* Scanline effect */}
                            <div className="hidden dark:block absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.05)_50%)] bg-[size:100%_4px] pointer-events-none rounded-2xl"></div>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                {/* Left: Avatar & Basic Info */}
                                <div className="flex sm:flex-col items-center gap-3 sm:gap-4 shrink-0">
                                    {/* Player Avatar */}
                                    <div className="relative">
                                        {/* Hologram base */}
                                        <div className="dark:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-4 bg-slate-900/10 blur-xl rounded-full"></div>
                                        <div className="hidden dark:block absolute bottom-0 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-6 sm:h-8 bg-emerald-500/20 blur-xl rounded-full"></div>

                                        <div className="relative z-10 filter drop-shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:drop-shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all scale-110">
                                            <MiniPlayer
                                                appearance={getPlayerAppearance(index)}
                                                position={player.isGoalkeeper ? 'GK' : 'FWD'}
                                                size={120}
                                            />
                                        </div>
                                    </div>

                                    {/* Number Badge */}
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-md
                                        bg-slate-100 border-2 border-slate-200 text-emerald-600
                                        dark:bg-black/60 dark:border-emerald-500/30 dark:text-emerald-400 dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                        {index + 1}
                                    </div>
                                </div>

                                {/* Right: Info & Stats */}
                                <div className="flex-1 min-w-0">
                                    {/* Header */}
                                    <div className="mb-4">
                                        <div className="flex-1">
                                            <h3 className="font-black text-xl sm:text-2xl transition-colors mb-1 sm:mb-2 tracking-tight truncate
                                            text-slate-900 group-hover:text-emerald-700
                                            dark:text-white dark:group-hover:text-emerald-300">
                                                {player.name}
                                            </h3>
                                            <div className="flex items-center flex-wrap gap-2 mt-0.5">
                                                <span className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 dark:text-emerald-600">
                                                    AGE {player.age}, DAY {player.ageDays}
                                                </span>
                                                {player.isYouth && (
                                                    <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded font-bold border
                                                        bg-emerald-50 text-emerald-600 border-emerald-200
                                                        dark:text-emerald-400 dark:border-emerald-400/30 dark:bg-emerald-500/10">
                                                        YTH
                                                    </span>
                                                )}
                                                <AbilityStars currentSkills={player.currentSkills} isGoalkeeper={player.isGoalkeeper} size="sm" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        <div className="rounded-xl p-2 border-2
                                            bg-amber-50 border-amber-200
                                            dark:bg-black/60 dark:border-amber-500/30">
                                            <div className="text-[9px] font-bold tracking-wider uppercase mb-1 text-amber-600">Stamina</div>
                                            <div className="text-2xl font-black text-amber-600 dark:text-amber-500">{Math.floor(player.stamina)}</div>
                                        </div>
                                        <div className="rounded-xl p-2 border-2
                                            bg-emerald-50 border-emerald-200
                                            dark:bg-black/60 dark:border-emerald-500/30">
                                            <div className="text-[9px] font-bold tracking-wider uppercase mb-1 text-emerald-600">Form</div>
                                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{Math.floor(player.form)}</div>
                                        </div>
                                        <div className="rounded-xl p-2 border-2
                                            bg-blue-50 border-blue-200
                                            dark:bg-black/60 dark:border-blue-500/30">
                                            <div className="text-[9px] font-bold tracking-wider uppercase mb-1 text-blue-600">EXP</div>
                                            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{player.experience || 0}</div>
                                        </div>
                                    </div>

                                    {/* Attributes by Category */}
                                    {renderPlayerSkills(player)}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 p-5 border-t 
                bg-slate-50/50 border-slate-200
                dark:border-emerald-500/20 dark:bg-black/20">
                <p className="text-sm font-mono text-center tracking-wider
                    text-slate-500 dark:text-emerald-600">
                    [ TOTAL: {players.length} PLAYERS ]
                </p>
            </div>
        </div>
    );
}
