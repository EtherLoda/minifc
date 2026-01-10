'use client';

import React, { useState, useEffect } from 'react';
import { api, Player } from '@/lib/api';
import { BenchConfig, BENCH_CONFIG_LABELS, BENCH_CONFIG_DESCRIPTIONS } from '@/types/team';
import { Position } from '@/types/player';
import { Settings } from 'lucide-react';

interface BenchConfigEditorProps {
    teamId: string;
    players: Player[];
    initialConfig?: BenchConfig | null;
    isOwnTeam: boolean;
}

export function BenchConfigEditor({ teamId, players, initialConfig, isOwnTeam }: BenchConfigEditorProps) {
    const [config, setConfig] = useState<BenchConfig>({
        goalkeeper: null,
        centerBack: null,
        fullback: null,
        winger: null,
        centralMidfield: null,
        forward: null
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (initialConfig) {
            setConfig(initialConfig);
        }
    }, [initialConfig]);

    const handlePlayerSelect = (key: keyof BenchConfig, playerId: string | null) => {
        setConfig(prev => ({
            ...prev,
            [key]: playerId
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.updateTeamBenchConfig(teamId, config);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error('Failed to save bench config:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setConfig({
            goalkeeper: null,
            centerBack: null,
            fullback: null,
            winger: null,
            centralMidfield: null,
            forward: null
        });
        setSaved(false);
    };

    const positionGroups: { key: keyof BenchConfig; label: string; description: string; positions: Position[] }[] = [
        { key: 'goalkeeper', label: 'GK', description: 'Goalkeeper', positions: ['GK'] },
        { key: 'centerBack', label: 'CD', description: 'Center Back', positions: ['DEF'] },
        { key: 'fullback', label: 'FB', description: 'Fullback (LB/RB)', positions: ['DEF'] },
        { key: 'winger', label: 'W', description: 'Winger (LW/RW)', positions: ['MID', 'FWD'] },
        { key: 'centralMidfield', label: 'CM', description: 'Central Midfield', positions: ['MID'] },
        { key: 'forward', label: 'FW', description: 'Forward', positions: ['FWD'] }
    ];

    const getPlayerById = (id: string | null): Player | undefined => {
        if (!id) return undefined;
        return players.find(p => p.id === id);
    };

    return (
        <div className="relative overflow-hidden rounded-xl border transition-all duration-300
            bg-white border-emerald-500/40 shadow-none
            dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:backdrop-blur-md">
            {/* Header */}
            <div className="relative z-10 p-5 border-b
                bg-white border-emerald-500/40
                dark:bg-transparent dark:border-emerald-500/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center
                            bg-emerald-100 dark:bg-emerald-900/40">
                            <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black italic mb-0
                                text-emerald-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-emerald-400 dark:to-green-400">
                                Bench Configuration
                            </h2>
                            <p className="text-emerald-600 text-xs font-mono tracking-wider uppercase">
                                Set default substitutes for each position
                            </p>
                        </div>
                    </div>

                    {isOwnTeam && (
                        <div className="flex items-center gap-2">
                            {saved && (
                                <span className="text-emerald-600 text-xs font-bold animate-pulse">
                                    ✓ Saved
                                </span>
                            )}
                            <button
                                onClick={handleReset}
                                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg
                                    bg-slate-100 text-slate-600 hover:bg-slate-200
                                    dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg
                                    bg-emerald-500 text-white hover:bg-emerald-600 transition-colors
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bench Config Grid */}
            <div className="relative z-10 p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {positionGroups.map(group => {
                        const selectedPlayerId = config[group.key];
                        const selectedPlayer = getPlayerById(selectedPlayerId);

                        return (
                            <div key={group.key} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black italic text-emerald-700 dark:text-emerald-400">
                                        {group.label}
                                    </span>
                                    <span className="text-[10px] text-emerald-500/70 dark:text-emerald-500/50 uppercase tracking-wider">
                                        {group.description}
                                    </span>
                                </div>

                                <select
                                    value={selectedPlayerId || ''}
                                    onChange={(e) => handlePlayerSelect(group.key, e.target.value || null)}
                                    disabled={!isOwnTeam}
                                    className="w-full px-3 py-2 text-sm rounded-lg border
                                        bg-white border-emerald-200 text-slate-700
                                        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        dark:bg-slate-800 dark:border-emerald-500/30 dark:text-slate-200"
                                >
                                    <option value="">— Not set —</option>
                                    {players
                                        .filter(p => group.positions.includes(p.position))
                                        .map(player => (
                                            <option key={player.id} value={player.id}>
                                                {player.name}
                                            </option>
                                        ))
                                    }
                                </select>

                                {selectedPlayer && (
                                    <div className="flex items-center gap-2 px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-900/20">
                                        <div className="w-6 h-6 rounded-full bg-emerald-200 dark:bg-emerald-700 flex items-center justify-center
                                            text-[10px] font-bold text-emerald-700 dark:text-emerald-200">
                                            {selectedPlayer.name.charAt(0)}
                                        </div>
                                        <span className="text-xs text-emerald-700 dark:text-emerald-300 truncate">
                                            {selectedPlayer.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 p-4 border-t
                bg-emerald-50 border-emerald-500/40
                dark:border-emerald-500/20 dark:bg-black/20">
                <p className="text-xs font-mono text-center tracking-wider
                    text-emerald-600 dark:text-emerald-600">
                    Configure bench players for tactical substitutions
                </p>
            </div>
        </div>
    );
}
