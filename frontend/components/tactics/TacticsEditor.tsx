'use client';

import { useState, useEffect } from 'react';
import { Player, api } from '@/lib/api';
import { PitchLayout } from './PitchLayout';
import { PlayerRoster } from './PlayerRoster';
import { Save, Lock, Clock } from 'lucide-react';
import { useNotification } from '@/components/ui/NotificationContext';

interface TacticsEditorProps {
    matchId: string;
    teamId: string;
    players: Player[];
    initialTactics: any;
    matchScheduledAt: string; // ISO date string
    matchStatus: string;
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

// Add direct mappings for backend positions that don't go through SLOT_MAPPING
// These are used by setup-match-db.ts script
BACKEND_TO_FRONTEND['GK'] = 'GK';
BACKEND_TO_FRONTEND['LB'] = 'LB';
BACKEND_TO_FRONTEND['CBL'] = 'CDL';  // Backend uses CBL, frontend uses CDL
BACKEND_TO_FRONTEND['CBR'] = 'CDR';  // Backend uses CBR, frontend uses CDR
BACKEND_TO_FRONTEND['RB'] = 'RB';
BACKEND_TO_FRONTEND['DML'] = 'DML';
BACKEND_TO_FRONTEND['DMR'] = 'DMR';
BACKEND_TO_FRONTEND['AML'] = 'AML';
BACKEND_TO_FRONTEND['AM'] = 'AM';
BACKEND_TO_FRONTEND['AMR'] = 'AMR';
BACKEND_TO_FRONTEND['CF'] = 'CF';
BACKEND_TO_FRONTEND['CF_L'] = 'CFL';
BACKEND_TO_FRONTEND['CF_R'] = 'CFR';
BACKEND_TO_FRONTEND['LM'] = 'LM';
BACKEND_TO_FRONTEND['RM'] = 'RM';
BACKEND_TO_FRONTEND['CML'] = 'CML';
BACKEND_TO_FRONTEND['CMR'] = 'CMR';

export function TacticsEditor({ matchId, teamId, players, initialTactics, matchScheduledAt, matchStatus }: TacticsEditorProps) {
    const [lineup, setLineup] = useState<Record<string, string | null>>(() => {
        const initial: Record<string, string | null> = {};
        POSITIONS.forEach(pos => initial[pos] = null);

        if (initialTactics?.lineup) {
            // Map backend slots back to frontend slots
            console.log('Backend lineup received:', initialTactics.lineup);
            Object.entries(initialTactics.lineup).forEach(([slot, playerId]) => {
                const frontendSlot = BACKEND_TO_FRONTEND[slot];
                console.log(`Mapping ${slot} -> ${frontendSlot}`);
                if (frontendSlot && POSITIONS.includes(frontendSlot)) {
                    initial[frontendSlot] = playerId as string;
                } else {
                    console.warn(`No frontend mapping for backend slot: ${slot}`);
                }
            });
            console.log('Final frontend lineup:', initial);
        }

        return initial;
    });

    const [draggedPlayer, setDraggedPlayer] = useState<string | null>(null);
    const [draggedFrom, setDraggedFrom] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTacticsLocked, setIsTacticsLocked] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const { showNotification } = useNotification();

    // Check tactics lock status and countdown
    useEffect(() => {
        const checkLockStatus = () => {
            // Lock tactics if match status is not 'scheduled'
            if (matchStatus !== 'scheduled') {
                setIsTacticsLocked(true);
                setCountdown(null);
                return;
            }

            const now = Date.now();
            const matchStartTime = new Date(matchScheduledAt).getTime();
            const timeUntilMatchStart = matchStartTime - now;
            const LOCK_THRESHOLD_MS = 30 * 60 * 1000; // 30 minutes

            // Lock tactics if less than 30 minutes until match starts
            if (timeUntilMatchStart <= LOCK_THRESHOLD_MS) {
                setIsTacticsLocked(true);
                // Show countdown to match start instead
                setCountdown(Math.max(0, Math.floor(timeUntilMatchStart / 1000)));
                return;
            }

            // Otherwise, show countdown to lock time
            setIsTacticsLocked(false);
            const timeUntilLock = timeUntilMatchStart - LOCK_THRESHOLD_MS;
            setCountdown(Math.max(0, Math.floor(timeUntilLock / 1000))); // seconds until lock
        };

        // Check immediately
        checkLockStatus();

        // Update every second
        const interval = setInterval(checkLockStatus, 1000);

        return () => clearInterval(interval);
    }, [matchScheduledAt, matchStatus]);

    const handleDragStart = (playerId: string, from: string | null) => {
        setDraggedPlayer(playerId);
        setDraggedFrom(from);
    };

    const handleDragEnd = () => {
        setDraggedPlayer(null);
        setDraggedFrom(null);
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
        // Check if tactics are locked
        if (isTacticsLocked) {
            showNotification({
                type: 'warning',
                title: 'Tactics Locked',
                message: 'Tactics deadline has passed. Match is about to start.',
            });
            return;
        }

        const validation = validateLineup();
        if (!validation.valid) {
            showNotification({
                type: 'warning',
                title: 'Invalid Lineup',
                message: validation.error!,
            });
            return;
        }

        setIsSubmitting(true);

        const backendLineup: Record<string, string> = {};
        Object.entries(lineup).forEach(([slot, playerId]) => {
            if (playerId && SLOT_MAPPING[slot]) {
                backendLineup[SLOT_MAPPING[slot]] = playerId;
            }
        });

        try {
            const formationStr = generateFormation();
            await api.submitTactics(matchId, teamId, backendLineup, formationStr);
            showNotification({
                type: 'success',
                title: 'Tactics Saved',
                message: `Your ${formationStr} formation has been submitted.`,
            });
        } catch (err) {
            showNotification({
                type: 'error',
                title: 'Save Failed',
                message: err instanceof Error ? err.message : 'Failed to submit tactics',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCountdown = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${secs}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${secs}s`;
        } else {
            return `${secs}s`;
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
                    onDragStart={(playerId, position) => handleDragStart(playerId, position)}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedPlayer !== null}
                />
            </div>

            {/* Player Roster & Controls */}
            <div className="space-y-4">
                {/* Tactics Lock Warning */}
                {isTacticsLocked && (
                    <div className="p-4 rounded-xl border-2 bg-red-50 border-red-500/40 dark:bg-red-950/20 dark:border-red-500/30">
                        <div className="flex items-center gap-3">
                            <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
                            <div className="flex-1">
                                <div className="text-sm font-bold text-red-900 dark:text-red-300">
                                    Tactics Locked
                                </div>
                                <div className="text-xs text-red-700 dark:text-red-400">
                                    {matchStatus === 'scheduled' && countdown !== null && countdown > 0 && (
                                        <>Match starts in {formatCountdown(countdown)}</>
                                    )}
                                    {matchStatus === 'tactics_locked' && 'Match starting soon...'}
                                    {matchStatus === 'in_progress' && 'Match in progress'}
                                    {matchStatus === 'completed' && 'Match completed'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Countdown Warning (show when < 5 minutes remaining) */}
                {!isTacticsLocked && countdown !== null && countdown < 300 && (
                    <div className="p-4 rounded-xl border-2 bg-amber-50 border-amber-500/40 dark:bg-amber-950/20 dark:border-amber-500/30">
                        <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse" />
                            <div>
                                <div className="text-sm font-bold text-amber-900 dark:text-amber-300">
                                    Time Running Out!
                                </div>
                                <div className="text-xs text-amber-700 dark:text-amber-400">
                                    Tactics lock in {formatCountdown(countdown)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

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
                    disabled={!validation.valid || isSubmitting || isTacticsLocked}
                    className={`w-full px-6 py-4 rounded-xl border-2 font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isTacticsLocked
                            ? 'bg-gray-400 text-white border-gray-400 dark:bg-gray-600 dark:border-gray-600'
                            : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500 shadow-lg dark:bg-emerald-500 dark:border-emerald-500 dark:hover:bg-emerald-400'
                    }`}
                >
                    <div className="flex items-center justify-center gap-2">
                        {isTacticsLocked ? (
                            <>
                                <Lock size={20} />
                                Tactics Locked
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                {isSubmitting ? 'Saving...' : 'Save Tactics'}
                            </>
                        )}
                    </div>
                </button>

                {!validation.valid && validation.error && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400 font-bold uppercase tracking-tight">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            {validation.error}
                        </div>
                    </div>
                )}

                {/* Player Roster */}
                <PlayerRoster
                    players={players}
                    assignedPlayerIds={assignedPlayerIds}
                    onDragStart={(playerId) => handleDragStart(playerId, null)}
                    onDragEnd={handleDragEnd}
                />
            </div>
        </div>
    );
}
