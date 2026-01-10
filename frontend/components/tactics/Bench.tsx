'use client';

import { Player } from '@/lib/api';
import { X, User } from 'lucide-react';
import { MiniPlayer } from '@/components/MiniPlayer';
import { generateAppearance, convertAppearance } from '@/utils/playerUtils';

interface BenchProps {
    bench: Record<string, string | null>;
    players: Player[];
    onDrop: (benchSlot: string) => void;
    onRemove: (benchSlot: string) => void;
    onDragStart: (playerId: string, position: string) => void;
    onDragEnd?: () => void;
    isDragging?: boolean;
}

// Position labels for bench slots (6 positions including GK)
const BENCH_LABELS = ['GK', 'CD', 'FB', 'W', 'CM', 'FW'];

export function Bench({ bench, players, onDrop, onRemove, onDragStart, onDragEnd, isDragging = false }: BenchProps) {
    const getPlayerById = (playerId: string | null) => {
        if (!playerId) return null;
        return players.find(p => p.id === playerId);
    };

    const handleDragStart = (playerId: string, position: string) => {
        onDragStart(playerId, position);
    };

    const handleDragEnd = () => {
        if (onDragEnd) {
            onDragEnd();
        }
    };

    const handleRemovePlayer = (benchSlot: string) => {
        onRemove(benchSlot);
    };

    const benchSlots = Object.keys(bench);

    return (
        <div className="mt-4 w-full max-w-[700px] mx-auto p-3 rounded-xl border-2 bg-white border-emerald-300 dark:bg-slate-900 dark:border-emerald-600/50">
            <div className="flex items-center gap-2 mb-3">
                <User size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Substitutes</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">(Drag players here)</span>
            </div>

            <div className="flex justify-between gap-2">
                {benchSlots.map((slot, index) => {
                    const player = getPlayerById(bench[slot]);
                    const appearance = player ? (convertAppearance(player.appearance) || generateAppearance(player.id)) : undefined;
                    const label = BENCH_LABELS[index] || `BENCH${index + 1}`;

                    return (
                        <div
                            key={slot}
                            className="flex-1 flex flex-col items-center"
                        >
                            {/* Position Label */}
                            <div className="mb-1.5 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700/50">
                                <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">{label}</span>
                            </div>

                            <div
                                className="flex items-center justify-center"
                                onDragOver={(e) => {
                                    e.preventDefault();
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    onDrop(slot);
                                }}
                            >
                                {player ? (
                                    <div
                                        draggable
                                        onDragStart={() => handleDragStart(player.id, slot)}
                                        onDragEnd={handleDragEnd}
                                        className="relative group cursor-move transition-transform duration-200 active:scale-95"
                                    >
                                        <div className="flex flex-col items-center">
                                            {/* Rounded square player slot - same size as pitch */}
                                            <div className="w-16 h-16 rounded-full border-2 border-white shadow-lg bg-emerald-800 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-400 transition-all relative overflow-hidden">
                                                {appearance && (
                                                    <MiniPlayer appearance={appearance} size={64} />
                                                )}
                                                {/* Remove button */}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleRemovePlayer(slot); }}
                                                    className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]"
                                                    title="Remove from bench"
                                                >
                                                    <X size={20} />
                                                </button>
                                            </div>
                                            {/* Player info */}
                                            <div className="mt-2 bg-gradient-to-br from-slate-900/95 via-emerald-950/90 to-slate-900/95 backdrop-blur-xl px-2 py-1 rounded-lg shadow-lg border border-emerald-500/30">
                                                <div className="text-[10px] font-bold text-white truncate max-w-[70px] text-center leading-tight">{player.name}</div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (isDragging) ? (
                                    <div
                                        className="w-16 h-16 rounded-full border-2 border-dashed border-white/50 flex items-center justify-center transition-all bg-white/10 hover:bg-white/20 hover:border-white/70 hover:scale-110 cursor-pointer"
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            onDrop(slot);
                                        }}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <User size={20} className="text-white/70" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-full border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50">
                                        <User size={18} className="text-slate-300 dark:text-slate-500" />
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
