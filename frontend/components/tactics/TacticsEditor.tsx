'use client';

import { useState } from 'react';
import { Player, api } from '@/lib/api';
import { PitchLayout } from './PitchLayout';
import { PlayerRoster } from './PlayerRoster';
import { Save } from 'lucide-react';

interface TacticsEditorProps {
    matchId: string;
    teamId: string;
    players: Player[];
    initialTactics: any;
}

const POSITIONS = [
    'GK', 'CD', 'CDL', 'CDR', 'LB', 'RB', 'WBL', 'WBR',
    'DM', 'DML', 'DMR', 'CM', 'CML', 'CMR', 'LM', 'RM',
    'AM', 'AML', 'AMR', 'LW', 'RW', 'CF', 'CFL', 'CFR'
];

const SLOT_MAPPING: Record<string, string> = {
    GK: 'GK',
    CD: 'CB1', CDL: 'CB2', CDR: 'CB3',
    LB: 'LB', RB: 'RB',
    WBL: 'LWB', WBR: 'RWB',
    DM: 'DMF1', DML: 'DMF2', DMR: 'DMF3',
    CM: 'CM1', CML: 'CM2', CMR: 'CM3',
    LM: 'LM', RM: 'RM',
    AM: 'CAM1', AML: 'CAM2', AMR: 'CAM3',
    LW: 'LW', RW: 'RW',
    CF: 'ST1', CFL: 'ST2', CFR: 'ST3'
};

const BACKEND_TO_FRONTEND: Record<string, string> = Object.entries(SLOT_MAPPING)
    .reduce((acc, [front, back]) => ({ ...acc, [back]: front }), {});

export function TacticsEditor({ matchId, teamId, players, initialTactics }: TacticsEditorProps) {
    const [lineup, setLineup] = useState<Record<string, string | null>>(() => {
        const initial: Record<string, string | null> = {};
        POSITIONS.forEach(pos => initial[pos] = null);

        if (initialTactics?.lineup) {
            // Map backend slots back to frontend slots
            Object.entries(initialTactics.lineup).forEach(([slot, playerId]) => {
                const frontendSlot = BACKEND_TO_FRONTEND[slot];
                if (frontendSlot && POSITIONS.includes(frontendSlot)) {
                    initial[frontendSlot] = playerId as string;
                }
            });
        }

        return initial;
    });

    const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
    const [draggedFrom, setDraggedFrom] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleDragStart = (playerId: string, from: string | null) => {
        setDraggedPlayer(playerId);
        setDraggedFrom(from);
    };

    const handleDrop = (position: string) => {
        if (!draggedPlayer) return;

        const newLineup = { ...lineup };

        // Remove player from previous position if dragged from pitch
        if (draggedFrom) {
            newLineup[draggedFrom] = null;
        }

        // Place player in new position
        newLineup[position] = draggedPlayer;

        setLineup(newLineup);
        setDraggedPlayer(null);
        setDraggedFrom(null);
    };

    const handleRemovePlayer = (position: string) => {
        setLineup(prev => ({ ...prev, [position]: null }));
    };

    const validateLineup = (): { valid: boolean; error?: string } => {
        const assignedPlayers = Object.values(lineup).filter(Boolean);
        const playerCount = assignedPlayers.length;

        if (!lineup.GK) {
            return { valid: false, error: 'Goalkeeper is required' };
        }

        if (playerCount < 9) {
            return { valid: false, error: `Minimum 9 players required (currently ${playerCount})` };
        }

        if (playerCount > 11) {
            return { valid: false, error: `Maximum 11 players allowed (currently ${playerCount})` };
        }

        return { valid: true };
    };

    const generateFormation = (): string => {
        const defenders = ['CDL', 'CD', 'CDR', 'LB', 'RB', 'WBL', 'WBR']
            .filter(pos => lineup[pos]).length;
        const midfielders = ['DML', 'DM', 'DMR', 'CML', 'CM', 'CMR', 'LM', 'RM']
            .filter(pos => lineup[pos]).length;
        const attackers = ['AML', 'AM', 'AMR', 'LW', 'RW', 'CFL', 'CF', 'CFR']
            .filter(pos => lineup[pos]).length;

        return `${defenders}-${midfielders}-${attackers}`;
    };

    const handleSubmit = async () => {
        const validation = validateLineup();
        if (!validation.valid) {
            setError(validation.error!);
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccess(false);

        const backendLineup: Record<string, string> = {};
        Object.entries(lineup).forEach(([slot, playerId]) => {
            if (playerId && SLOT_MAPPING[slot]) {
                backendLineup[SLOT_MAPPING[slot]] = playerId;
            }
        });

        try {
            const formationStr = generateFormation();
            await api.submitTactics(matchId, teamId, backendLineup, formationStr);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit tactics');
        } finally {
            setIsSubmitting(false);
        }
    };

    const validation = validateLineup();
    const formation = generateFormation();
    const assignedPlayerIds = new Set(Object.values(lineup).filter((id): id is string => id !== null));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-6">
            {/* Pitch Layout */}
            <div>
                <PitchLayout
                    lineup={lineup}
                    players={players}
                    onDrop={handleDrop}
                    onRemove={handleRemovePlayer}
                    onDragStart={handleDragStart}
                />
            </div>

            {/* Player Roster & Controls */}
            <div className="space-y-4">
                {/* Formation & Validation Info */}
                <div className="p-4 rounded-xl border-2 bg-white border-emerald-500/40 dark:bg-emerald-950/20 dark:border-emerald-500/30">
                    <div className="space-y-3">
                        <div>
                            <div className="text-xs text-slate-500 dark:text-emerald-600 uppercase tracking-wider mb-1">
                                Formation
                            </div>
                            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-400">
                                {formation}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500 dark:text-emerald-600 uppercase tracking-wider mb-1">
                                Players
                            </div>
                            <div className={`text-lg font-bold ${validation.valid
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-amber-600 dark:text-amber-400'
                                }`}>
                                {Object.values(lineup).filter(Boolean).length} / 11
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={!validation.valid || isSubmitting}
                    className="w-full px-6 py-4 rounded-xl border-2 font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed
                        bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500 shadow-lg
                        dark:bg-emerald-500 dark:border-emerald-500 dark:hover:bg-emerald-400"
                >
                    <div className="flex items-center justify-center gap-2">
                        <Save size={20} />
                        {isSubmitting ? 'Saving...' : 'Save Tactics'}
                    </div>
                </button>

                {/* Error/Success Messages */}
                {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400">
                        Tactics saved successfully!
                    </div>
                )}
                {!validation.valid && validation.error && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400">
                        {validation.error}
                    </div>
                )}

                {/* Player Roster */}
                <PlayerRoster
                    players={players}
                    assignedPlayerIds={assignedPlayerIds}
                    onDragStart={(playerId) => handleDragStart(playerId, null)}
                />
            </div>
        </div>
    );
}
