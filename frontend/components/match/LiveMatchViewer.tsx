'use client';

import { useMatchPolling } from '@/hooks/useMatchPolling';
import { useMatchSimulation } from '@/hooks/useMatchSimulation';
import { EventTimeline } from '@/components/match/EventTimeline';
import { MatchStats } from '@/components/match/MatchStats';
import { TeamLineupView } from '@/components/match/TeamLineupView';
import { MatchPitchView } from '@/components/match/MatchPitchView';
import { MatchTimeline } from '@/components/match/MatchTimeline';
import { TacticalAnalysis } from '@/components/match/TacticalAnalysis';
import { MatchSummary } from '@/components/match/MatchSummary';
import { MatchHighlights } from '@/components/match/MatchHighlights';
import { MatchEventsResponse, MatchStatsRes, TeamSnapshot } from '@/lib/api';
import { Play, Loader2, Clock } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';

interface LiveMatchViewerProps {
    matchId: string;
    homeTeamId: string;
    awayTeamId: string;
    homeTeamName: string;
    awayTeamName: string;
    initialEventsData: MatchEventsResponse;
    initialStats: MatchStatsRes | null;
    matchStatus: string;
    onScoreUpdate?: (score: { home: number; away: number }) => void; // Callback to update parent
}

export function LiveMatchViewer({
    matchId,
    homeTeamId,
    awayTeamId,
    homeTeamName,
    awayTeamName,
    initialEventsData,
    initialStats,
    matchStatus,
    onScoreUpdate,
}: LiveMatchViewerProps) {
    // We use useMatchPolling for regular 5-second updates
    // and useMatchSimulation if we want to manually trigger/follow a simulation.
    const { data: pollingData } = useMatchPolling(matchId, initialEventsData);
    const { startSimulation, isSimulating, error, data: simData } = useMatchSimulation(matchId, initialEventsData);

    const data = simData || pollingData || initialEventsData;
    const eventsData = data;
    const canSimulate = matchStatus === 'scheduled' || matchStatus === 'tactics_locked';
    const isLive = matchStatus === 'in_progress';
    const isCompleted = matchStatus === 'completed';

    // Consolidate current stats (prefer real-time data from polling/sim if available)
    const currentStats = (data as any)?.stats || initialStats;

    // Notify parent of score updates
    useEffect(() => {
        if (onScoreUpdate && eventsData.currentScore) {
            onScoreUpdate(eventsData.currentScore);
        }
    }, [eventsData.currentScore, onScoreUpdate]);

    // Live match minute display
    const [liveMinute, setLiveMinute] = useState(eventsData.currentMinute || 0);

    // Selected minute for timeline scrubbing
    const [selectedMinute, setSelectedMinute] = useState(eventsData.currentMinute || 0);

    // Update live minute when data changes
    useEffect(() => {
        setLiveMinute(eventsData.currentMinute || 0);
        // Auto-update selectedMinute to follow live match if not manually scrubbing
        if (selectedMinute === liveMinute || selectedMinute === 0) {
            setSelectedMinute(eventsData.currentMinute || 0);
        }
    }, [eventsData.currentMinute]);

    // Extract and hydrate player states from snapshot at selected minute
    const { homeSnapshot, awaySnapshot, initialStamina } = useMemo(() => {
        const snapshotEvents = eventsData.events.filter(e => {
            const typeName = typeof e.typeName === 'string' ? e.typeName.toUpperCase() : '';
            const type = typeof e.type === 'string' ? e.type.toUpperCase() : '';
            return typeName === 'SNAPSHOT' || type === 'SNAPSHOT';
        }).sort((a, b) => a.minute - b.minute);

        const firstSnapshot = snapshotEvents[0];
        if (!firstSnapshot) return { homeSnapshot: null, awaySnapshot: null, initialStamina: new Map() };

        // Helper to extract team data (handles both old and new compressed format)
        const getRawTeam = (data: any, side: 'h' | 'a') => {
            const oldKey = side === 'h' ? 'home' : 'away';
            return data[side] || data[oldKey];
        };

        // Static Registry from Min 0 (Full Snapshot)
        const staticRegistry = new Map<string, any>();
        const hydrateTeam = (rawTeam: any) => {
            if (!rawTeam) return null;

            // Map compressed to full
            const ps = rawTeam.ps || rawTeam.players || [];
            const hydratedPlayers = ps.map((p: any) => {
                const id = p.id || p.playerId;

                // If it's a compressed player state, hydrate it
                const hydrated = {
                    playerId: id,
                    name: p.n || p.name || staticRegistry.get(id)?.name,
                    position: p.p || p.position,
                    stamina: p.st !== undefined ? p.st : p.stamina,
                    form: p.f !== undefined ? p.f : p.form,
                    overall: p.o || p.overall || staticRegistry.get(id)?.overall,
                    conditionMultiplier: p.cm !== undefined ? p.cm : p.conditionMultiplier,
                    contribution: p.pc,
                    multiplier: p.cm,
                    entryMinute: p.em || 0,
                    appearance: p.ap || staticRegistry.get(id)?.appearance,
                    experience: p.ex || p.experience || staticRegistry.get(id)?.experience,
                    age: p.age !== undefined ? p.age : staticRegistry.get(id)?.age,
                    ageDays: p.ad !== undefined ? p.ad : staticRegistry.get(id)?.ageDays,
                };

                // Save to registry if data is present
                if (hydrated.name) staticRegistry.set(id, {
                    name: hydrated.name,
                    appearance: hydrated.appearance,
                    age: hydrated.age,
                    ageDays: hydrated.ageDays,
                    entryMinute: hydrated.entryMinute,
                });

                return hydrated;
            });

            // Map Lane Strengths
            const rawLs = rawTeam.ls || rawTeam.laneStrengths;
            const hydratedLs: any = {};
            if (rawLs) {
                Object.entries(rawLs).forEach(([lane, phases]: [string, any]) => {
                    hydratedLs[lane] = {
                        attack: phases.atk !== undefined ? phases.atk : phases.attack,
                        defense: phases.def !== undefined ? phases.def : phases.defense,
                        possession: phases.pos !== undefined ? phases.pos : phases.possession,
                    };
                });
            }

            return {
                teamName: rawTeam.n || rawTeam.teamName,
                gkRating: rawTeam.gk !== undefined ? rawTeam.gk : rawTeam.gkRating,
                laneStrengths: hydratedLs,
                players: hydratedPlayers
            } as TeamSnapshot;
        };

        // Pre-fill registry with Min 0
        hydrateTeam(getRawTeam(firstSnapshot.data, 'h'));
        hydrateTeam(getRawTeam(firstSnapshot.data, 'a'));

        // Initial Stamina Map (needed for UI progress bars)
        const initialStaminaMap = new Map<string, number>();
        staticRegistry.forEach((val, id) => {
            // Find in first snapshot specifically for starting stamina
            const hPlayers = (getRawTeam(firstSnapshot.data, 'h')?.ps || getRawTeam(firstSnapshot.data, 'h')?.players || []);
            const aPlayers = (getRawTeam(firstSnapshot.data, 'a')?.ps || getRawTeam(firstSnapshot.data, 'a')?.players || []);
            const p = hPlayers.find((x: any) => (x.id || x.playerId) === id) ||
                aPlayers.find((x: any) => (x.id || x.playerId) === id);
            if (p) initialStaminaMap.set(id, p.st || p.stamina);
        });

        // Get relevant snapshot
        const relevantSnapshot = snapshotEvents
            .filter(s => s.minute <= selectedMinute)
            .pop(); // Last one <= selectedMinute

        if (!relevantSnapshot?.data) {
            return { homeSnapshot: null, awaySnapshot: null, initialStamina: initialStaminaMap };
        }

        return {
            homeSnapshot: hydrateTeam(getRawTeam(relevantSnapshot.data, 'h')),
            awaySnapshot: hydrateTeam(getRawTeam(relevantSnapshot.data, 'a')),
            initialStamina: initialStaminaMap
        };
    }, [eventsData.events, selectedMinute]);

    // Get current events (for highlights) - uses latest available data
    const currentEvents = simData?.events || pollingData?.events || initialEventsData.events;

    return (
        <>
            {/* Simulation Control */}
            {canSimulate && (
                <div className="mb-6">
                    <button
                        onClick={startSimulation}
                        disabled={isSimulating}
                        className="group relative px-8 py-4 border-2 overflow-hidden transition-all rounded-xl bg-white border-emerald-500/40 hover:border-emerald-500 shadow-none disabled:opacity-50 disabled:cursor-not-allowed dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:hover:border-emerald-400"
                    >
                        <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl bg-emerald-50 dark:bg-emerald-500/10"></div>
                        <span className="relative font-bold uppercase tracking-widest transition-colors flex items-center gap-3 text-emerald-900 group-hover:text-emerald-700 dark:text-emerald-400 dark:group-hover:text-white">
                            {isSimulating ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Simulating Match...
                                </>
                            ) : (
                                <>
                                    <Play size={20} />
                                    Simulate Match
                                </>
                            )}
                        </span>
                    </button>
                    {error && (
                        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
                    )}
                </div>
            )}

            {/* Team Lineups - HIDDEN as per requirements */}
            {/* {(homeSnapshot || awaySnapshot) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {homeSnapshot && (
                        <TeamLineupView
                            teamName={homeSnapshot.teamName || homeTeamName}
                            players={homeSnapshot.players || []}
                        />
                    )}
                    {awaySnapshot && (
                        <TeamLineupView
                            teamName={awaySnapshot.teamName || awayTeamName}
                            players={awaySnapshot.players || []}
                        />
                    )}
                </div>
            )} */}

            {/* Match Content Grid */}
            <div className="space-y-6">

                {/* Match Timeline - Positioned above pitch for better visibility */}
                {(isLive || isCompleted) && eventsData.events.length > 0 && (
                    <MatchTimeline
                        events={eventsData.events}
                        totalMinutes={eventsData.totalMinutes || 90}
                        currentMinute={liveMinute}
                        onTimeSelect={(minute) => setSelectedMinute(minute)}
                    />
                )}

                {/* Tactical Analysis with integrated Pitch View - Toggle between tactical grid and player formation */}
                {(homeSnapshot && awaySnapshot) && (
                    <div>
                        <TacticalAnalysis
                            homeSnapshot={homeSnapshot}
                            awaySnapshot={awaySnapshot}
                            homeTeamName={homeTeamName}
                            awayTeamName={awayTeamName}
                            initialStamina={initialStamina}
                        />
                    </div>
                )}


                {/* Events Timeline and Highlights - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Events Timeline */}
                    <div className="md:col-span-2">
                        <EventTimeline
                            events={eventsData.events.filter(e => {
                                // Filter out snapshot events from timeline
                                const typeName = typeof e.typeName === 'string' ? e.typeName.toUpperCase() : '';
                                const type = typeof e.type === 'string' ? e.type.toUpperCase() : '';
                                return typeName !== 'SNAPSHOT' && type !== 'SNAPSHOT';
                            })}
                            isLive={isLive}
                            currentMinute={liveMinute}
                            currentScore={eventsData.currentScore}
                            homeTeamName={homeTeamName}
                            awayTeamName={awayTeamName}
                        />
                    </div>

                    {/* Match Highlights & Summary */}
                    <div className="md:col-span-1 space-y-6">
                        <MatchHighlights
                            events={currentEvents}
                            homeTeamName={homeTeamName}
                            awayTeamName={awayTeamName}
                        />

                        {isCompleted && homeSnapshot && awaySnapshot && (
                            <MatchSummary
                                homeTeamName={homeTeamName}
                                awayTeamName={awayTeamName}
                                homeSnapshot={homeSnapshot}
                                awaySnapshot={awaySnapshot}
                                homeShots={currentStats?.home?.shots || 0}
                                awayShots={currentStats?.away?.shots || 0}
                                homeGoals={eventsData.currentScore?.home || 0}
                                awayGoals={eventsData.currentScore?.away || 0}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
