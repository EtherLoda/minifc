'use client';

import { useState } from 'react';
import { PlayerState, MatchEvent } from '@/lib/api';
import { MiniPlayer } from '@/components/MiniPlayer';
import { generateAppearance } from '@/utils/playerUtils';
import { Activity, Zap, User, TrendingUp, Goal, Users, Clock } from 'lucide-react';

type ViewMode = 'info' | 'stamina' | 'performance';

interface MatchPitchViewProps {
    homeTeamName: string;
    awayTeamName: string;
    homePlayers: PlayerState[];
    awayPlayers: PlayerState[];
    initialStamina?: Map<string, number>; // Map of playerId -> initial stamina at minute 0
    events?: MatchEvent[]; // Optional: for timeline
    totalMinutes?: number; // Optional: for timeline
    currentMinute?: number; // Optional: for timeline
    onTimeSelect?: (minute: number) => void; // Optional: callback when user selects a time
}

interface PlayerCardProps {
    player: PlayerState;
    isHome: boolean;
    viewMode: ViewMode;
    initialStamina?: number; // Player's starting stamina value
}

// Position coordinates for horizontal pitch (home on left 0-50%, away on right 50-100%)
// Home team: 11 positions evenly spread in left half
// Away team: 11 positions mirrored in right half
// Total 22 positions across full pitch
// Y-axis spacing consistent with tactics PitchLayout (±18% from center)
const POSITION_COORDS: Record<string, { x: number; y: number }> = {
    // ===== GOALKEEPER (x: 5%) =====
    GK: { x: 5, y: 50 },
    
    // ===== DEFENSE (x: 15%) =====
    LB: { x: 15, y: 8 },    // Left back (wide)
    CB1: { x: 15, y: 32 },  // Left center back (±18% from center like CM)
    CB2: { x: 15, y: 50 },  // Center back
    CB3: { x: 15, y: 68 },  // Right center back (±18% from center)
    RB: { x: 15, y: 92 },   // Right back (wide)
    
    // ===== WINGBACKS (x: 20%) =====
    LWB: { x: 20, y: 8 },   // Left wingback
    RWB: { x: 20, y: 92 },  // Right wingback
    
    // ===== DEFENSIVE MIDFIELD (x: 25%) =====
    DMF1: { x: 25, y: 32 }, // Left DMF
    DMF2: { x: 25, y: 50 }, // Center DMF
    DMF3: { x: 25, y: 68 }, // Right DMF
    
    // ===== CENTRAL MIDFIELD (x: 30%) =====
    LM: { x: 30, y: 8 },    // Left midfielder (wide)
    CM1: { x: 30, y: 32 },  // Left CM
    CM2: { x: 30, y: 50 },  // Center CM
    CM3: { x: 30, y: 68 },  // Right CM
    RM: { x: 30, y: 92 },   // Right midfielder (wide)
    
    // ===== ATTACKING MIDFIELD (x: 37%) =====
    CAM1: { x: 37, y: 32 }, // Left CAM
    CAM2: { x: 37, y: 50 }, // Center CAM
    CAM3: { x: 37, y: 68 }, // Right CAM
    
    // ===== FORWARDS (x: 45%) =====
    LW: { x: 45, y: 8 },    // Left winger (wide)
    ST1: { x: 45, y: 32 },  // Left striker
    ST2: { x: 45, y: 50 },  // Center striker
    ST3: { x: 45, y: 68 },  // Right striker
    RW: { x: 45, y: 92 },   // Right winger (wide)
};

function PlayerCard({ player, isHome, viewMode, initialStamina }: PlayerCardProps) {
    const appearance = generateAppearance(player.playerId);
    
    // Stamina calculation with proper initial values:
    // - Each player has their own initial stamina (3-6 range) from match start
    // - We calculate percentage relative to THEIR starting stamina, not a fixed max
    // - 25% buffer rule: display 100% if current >= 75% of their initial stamina
    
    const currentStamina = player.stamina;
    const playerInitialStamina = initialStamina || 6.0; // Fallback to 6.0 if not provided
    
    // Calculate stamina ratio relative to this player's starting value
    const staminaRatio = currentStamina / playerInitialStamina;
    
    // Calculate display percentage with 25% buffer
    // If stamina >= 75% of their initial stamina, show 100%
    // Below 75%, scale from 100% to 0%
    let staminaPercentage: number;
    const bufferThreshold = 0.75; // 75% threshold
    
    if (staminaRatio >= bufferThreshold) {
        staminaPercentage = 100;
    } else {
        // Linear scale from 75% stamina = 100% display to 0% stamina = 0% display
        staminaPercentage = Math.round((staminaRatio / bufferThreshold) * 100);
    }
    
    // Performance = positionalContribution × conditionMultiplier
    // - positionalContribution: Player's contribution in their position across 3 lanes × 3 phases
    //   (left/center/right) × (attack/defense/possession) - summed before condition multiplier
    // - conditionMultiplier: Impact of stamina, form, experience (0.78-1.2+)
    const contribution = player.positionalContribution || 50; // Fallback if missing
    const conditionMult = player.conditionMultiplier || 1.0; // Fallback if missing
    const performance = Math.round(contribution * conditionMult);
    
    // Info Mode: Show avatar, name, and position (no performance)
    if (viewMode === 'info') {
        return (
            <div className="relative">
                {/* Rounded Rectangle Card */}
                <div className={`relative w-[70px] rounded-lg overflow-hidden shadow-lg border-2 ${
                    isHome 
                        ? 'border-blue-400 dark:border-blue-500' 
                        : 'border-red-400 dark:border-red-500'
                }`}>
                    {/* Substitute Badge */}
                    {player.isSubstitute && (
                        <div className="absolute top-0.5 right-0.5 z-20 bg-orange-500 text-white text-[6px] font-bold px-1 py-0.5 rounded shadow-md">
                            SUB
                        </div>
                    )}
                    
                    {/* Top Section: Avatar */}
                    <div className={`relative h-14 flex items-center justify-center ${
                        isHome 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800' 
                            : 'bg-gradient-to-br from-red-600 to-red-700 dark:from-red-700 dark:to-red-800'
                    }`}>
                        {appearance && (
                            <div className="mt-1.5">
                                <MiniPlayer 
                                    appearance={appearance} 
                                    size={50} 
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* Bottom Section: Info */}
                    <div className="bg-white dark:bg-slate-900 px-2 py-2">
                        {/* Name */}
                        <div className="text-[8px] font-black text-slate-900 dark:text-white truncate text-center mb-1.5">
                            {player.name.split(' ').pop()}
                        </div>
                        
                        {/* Position - Same height as stamina bar */}
                        <div className="relative w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex items-center justify-center">
                            <span className="text-[9px] font-black text-slate-700 dark:text-slate-300">
                                {player.position}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Stamina Mode: Show percentage indicator with avatar
    if (viewMode === 'stamina') {
        // Determine stamina color
        const staminaColor = staminaPercentage >= 80 
            ? { border: 'border-green-500', gradient: 'from-green-500 to-green-600', bg: 'bg-green-500' }
            : staminaPercentage >= 60 
            ? { border: 'border-yellow-500', gradient: 'from-yellow-500 to-yellow-600', bg: 'bg-yellow-500' }
            : { border: 'border-red-500', gradient: 'from-red-500 to-red-600', bg: 'bg-red-500' };
        
        return (
            <div className="relative">
                {/* Rounded Rectangle Card */}
                <div className={`relative w-[70px] rounded-lg overflow-hidden shadow-lg border-2 ${staminaColor.border}`}>
                    {/* Substitute Badge */}
                    {player.isSubstitute && (
                        <div className="absolute top-0.5 right-0.5 z-20 bg-orange-500 text-white text-[6px] font-bold px-1 py-0.5 rounded shadow-md">
                            SUB
                        </div>
                    )}
                    
                    {/* Top Section: Avatar */}
                    <div className={`relative h-14 flex items-center justify-center ${
                        isHome 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800' 
                            : 'bg-gradient-to-br from-red-600 to-red-700 dark:from-red-700 dark:to-red-800'
                    }`}>
                        {appearance && (
                            <div className="mt-1.5">
                                <MiniPlayer 
                                    appearance={appearance} 
                                    size={50} 
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* Bottom Section: Stamina Info */}
                    <div className="bg-white dark:bg-slate-900 px-2 py-2">
                        {/* Name */}
                        <div className="text-[8px] font-black text-slate-900 dark:text-white truncate text-center mb-1.5">
                            {player.name.split(' ').pop()}
                        </div>
                        
                        {/* Stamina Bar */}
                        <div className="relative w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full bg-gradient-to-r ${staminaColor.gradient} transition-all duration-300`}
                                style={{ width: `${staminaPercentage}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[9px] font-black text-white drop-shadow-md">
                                    {staminaPercentage}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // Performance Mode: Show current performance (OVR * conditionMultiplier) with avatar
    if (viewMode === 'performance') {
        // Determine performance color
        const performanceColor = performance >= 80 
            ? { border: 'border-emerald-500', gradient: 'from-emerald-500 to-emerald-600' }
            : performance >= 60 
            ? { border: 'border-blue-500', gradient: 'from-blue-500 to-blue-600' }
            : { border: 'border-slate-500', gradient: 'from-slate-500 to-slate-600' };
        
        return (
            <div className="relative">
                {/* Rounded Rectangle Card */}
                <div className={`relative w-[70px] rounded-lg overflow-hidden shadow-lg border-2 ${performanceColor.border}`}>
                    {/* Substitute Badge */}
                    {player.isSubstitute && (
                        <div className="absolute top-0.5 right-0.5 z-20 bg-orange-500 text-white text-[6px] font-bold px-1 py-0.5 rounded shadow-md">
                            SUB
                        </div>
                    )}
                    
                    {/* Top Section: Avatar */}
                    <div className={`relative h-14 flex items-center justify-center ${
                        isHome 
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800' 
                            : 'bg-gradient-to-br from-red-600 to-red-700 dark:from-red-700 dark:to-red-800'
                    }`}>
                        {appearance && (
                            <div className="mt-1.5">
                                <MiniPlayer 
                                    appearance={appearance} 
                                    size={50} 
                                />
                            </div>
                        )}
                    </div>
                    
                    {/* Bottom Section: Performance Info */}
                    <div className="bg-white dark:bg-slate-900 px-2 py-2">
                        {/* Name */}
                        <div className="text-[8px] font-black text-slate-900 dark:text-white truncate text-center mb-1.5">
                            {player.name.split(' ').pop()}
                        </div>
                        
                        {/* Performance Bar - Same height as stamina bar */}
                        <div className="relative w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full bg-gradient-to-r ${performanceColor.gradient} transition-all duration-300 ${
                                    performance >= 80 ? 'animate-pulse' : ''
                                }`}
                                style={{ width: `${Math.min(performance, 100)}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[9px] font-black text-white drop-shadow-md">
                                    {performance}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return null;
}

export function MatchPitchView({ homeTeamName, awayTeamName, homePlayers, awayPlayers, initialStamina }: MatchPitchViewProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('info');
    
    const homeStarters = homePlayers.filter(p => !p.isSubstitute);
    const homeSubs = homePlayers.filter(p => p.isSubstitute);
    const awayStarters = awayPlayers.filter(p => !p.isSubstitute);
    const awaySubs = awayPlayers.filter(p => p.isSubstitute);

    // Create position map for home team (left side)
    const homePositionMap: Record<string, PlayerState> = {};
    homeStarters.forEach(player => {
        homePositionMap[player.position] = player;
    });

    // Create position map for away team (right side - mirrored)
    const awayPositionMap: Record<string, PlayerState> = {};
    awayStarters.forEach(player => {
        awayPositionMap[player.position] = player;
    });

    return (
        <div className="rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-emerald-900/10 shadow-lg overflow-hidden">
            {/* Header with both teams and view mode toggle */}
            <div className="p-4 border-b-2 border-emerald-500/40 dark:border-emerald-500/30 bg-white/80 dark:bg-emerald-950/40 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                    <div className="text-left">
                        <h3 className="text-lg font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
                            {homeTeamName}
                        </h3>
                        <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">Home</p>
                    </div>
                    <div className="text-center">
                        <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Match Formation</div>
                    </div>
                    <div className="text-right">
                        <h3 className="text-lg font-bold uppercase tracking-wider text-red-900 dark:text-red-300">
                            {awayTeamName}
                        </h3>
                        <p className="text-xs text-red-700 dark:text-red-400 mt-1">Away</p>
                    </div>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setViewMode('info')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            viewMode === 'info'
                                ? 'bg-emerald-600 text-white shadow-md'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                        }`}
                    >
                        <User className="h-3.5 w-3.5" />
                        <span>Player Info</span>
                    </button>
                    <button
                        onClick={() => setViewMode('stamina')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            viewMode === 'stamina'
                                ? 'bg-yellow-600 text-white shadow-md'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                        }`}
                    >
                        <Zap className="h-3.5 w-3.5" />
                        <span>Stamina</span>
                    </button>
                    <button
                        onClick={() => setViewMode('performance')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            viewMode === 'performance'
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                        }`}
                    >
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span>Performance</span>
                    </button>
                </div>
            </div>

            {/* Horizontal Pitch */}
            <div className="p-6">
                <div className="relative w-full aspect-[16/7] rounded-xl border-4 border-white/30 shadow-2xl bg-gradient-to-br from-[#2d5016] via-[#3a6b1f] to-[#2d5016] dark:from-[#1a3d0f] dark:via-[#2d5016] dark:to-[#1a3d0f] overflow-hidden">
                    {/* Grass Pattern - horizontal stripes */}
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_4%,rgba(0,0,0,0.03)_4%,rgba(0,0,0,0.03)_8%)] pointer-events-none" />

                    {/* Pitch Markings */}
                    <div className="absolute inset-0 opacity-50 pointer-events-none">
                        {/* Center circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
                        {/* Center line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white" />
                        
                        {/* Left penalty area (home) */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[16%] h-[60%] border-2 border-white border-l-0" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[6%] h-[30%] border-2 border-white border-l-0" />
                        {/* Left goal line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[20%] bg-white" />
                        
                        {/* Right penalty area (away) */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[16%] h-[60%] border-2 border-white border-r-0" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[6%] h-[30%] border-2 border-white border-r-0" />
                        {/* Right goal line */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-[20%] bg-white" />
                    </div>

                    {/* Home Team Players (Left Side) */}
                    <div className="absolute inset-0">
                        {Object.entries(POSITION_COORDS).map(([position, coords]) => {
                            const player = homePositionMap[position];
                            if (!player) return null;

                            return (
                                <div
                                    key={`home-${position}`}
                                    className="absolute z-10"
                                    style={{
                                        left: `${coords.x}%`,
                                        top: `${coords.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    <PlayerCard 
                                        player={player} 
                                        isHome={true} 
                                        viewMode={viewMode} 
                                        initialStamina={initialStamina?.get(player.playerId)}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Away Team Players (Right Side - Mirrored) */}
                    <div className="absolute inset-0">
                        {Object.entries(POSITION_COORDS).map(([position, coords]) => {
                            const player = awayPositionMap[position];
                            if (!player) return null;

                            // Mirror X coordinate for away team (100 - x)
                            const mirroredX = 100 - coords.x;

                            return (
                                <div
                                    key={`away-${position}`}
                                    className="absolute z-10"
                                    style={{
                                        left: `${mirroredX}%`,
                                        top: `${coords.y}%`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                >
                                    <PlayerCard 
                                        player={player} 
                                        isHome={false} 
                                        viewMode={viewMode}
                                        initialStamina={initialStamina?.get(player.playerId)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Substitutes Section */}
                {(homeSubs.length > 0 || awaySubs.length > 0) && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Home Subs */}
                        {homeSubs.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2 uppercase tracking-wide">
                                    {homeTeamName} - Substitutes
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {homeSubs.map(player => (
                                        <div key={player.playerId} className="flex-shrink-0">
                                            <PlayerCard 
                                                player={player} 
                                                isHome={true} 
                                                viewMode={viewMode}
                                                initialStamina={initialStamina?.get(player.playerId)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Away Subs */}
                        {awaySubs.length > 0 && (
                            <div>
                                <h4 className="text-sm font-bold text-red-900 dark:text-red-300 mb-2 uppercase tracking-wide">
                                    {awayTeamName} - Substitutes
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {awaySubs.map(player => (
                                        <div key={player.playerId} className="flex-shrink-0">
                                            <PlayerCard 
                                                player={player} 
                                                isHome={false} 
                                                viewMode={viewMode}
                                                initialStamina={initialStamina?.get(player.playerId)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
