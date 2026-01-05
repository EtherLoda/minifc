'use client';

import { TeamSnapshot, PlayerState } from '@/lib/api';
import { Shield, Swords, Target, TrendingUp, TrendingDown, Grid3x3, Users } from 'lucide-react';
import { useState } from 'react';
import { MiniPlayer } from '@/components/MiniPlayer';
import { generateAppearance } from '@/utils/playerUtils';

interface TacticalAnalysisProps {
    homeSnapshot: TeamSnapshot | null;
    awaySnapshot: TeamSnapshot | null;
    homeTeamName: string;
    awayTeamName: string;
    initialStamina?: Map<string, number>;
}

// Convert numbered positions to directional names for display
function formatPositionName(position: string): string {
    const positionMap: Record<string, string> = {
        'CB1': 'CBL', 'CB2': 'CB', 'CB3': 'CBR',
        'DMF1': 'DML', 'DMF2': 'DM', 'DMF3': 'DMR',
        'DMF': 'DM', 'CDM': 'DM',
        'CM1': 'CML', 'CM2': 'CM', 'CM3': 'CMR',
        'CAM1': 'AML', 'CAM2': 'AM', 'CAM3': 'AMR',
        'CAM': 'AM',
        'ST1': 'CF_L', 'ST2': 'CF', 'ST3': 'CF_R',
        'ST': 'CF',
    };
    return positionMap[position] || position;
}

// Position coordinates for the pitch
const POSITION_COORDS: Record<string, { x: number; y: number }> = {
    GK: { x: 5, y: 50 },
    LB: { x: 15, y: 12 }, CBL: { x: 15, y: 32 }, CB: { x: 15, y: 50 }, CBR: { x: 15, y: 68 }, RB: { x: 15, y: 88 },
    CB1: { x: 15, y: 32 }, CB2: { x: 15, y: 50 }, CB3: { x: 15, y: 68 },
    LWB: { x: 20, y: 12 }, WB: { x: 20, y: 50 }, WBR: { x: 20, y: 68 }, RWB: { x: 20, y: 88 },
    DML: { x: 25, y: 32 }, DM: { x: 25, y: 50 }, DMR: { x: 25, y: 68 }, CDM: { x: 25, y: 50 },
    DMF1: { x: 25, y: 32 }, DMF2: { x: 25, y: 50 }, DMF3: { x: 25, y: 68 },
    LM: { x: 30, y: 12 }, CML: { x: 30, y: 32 }, CM: { x: 30, y: 50 }, CMR: { x: 30, y: 68 }, RM: { x: 30, y: 88 },
    CM1: { x: 30, y: 32 }, CM2: { x: 30, y: 50 }, CM3: { x: 30, y: 68 },
    AML: { x: 37, y: 32 }, AM: { x: 37, y: 50 }, AMR: { x: 37, y: 68 }, CAM: { x: 37, y: 50 },
    CAM1: { x: 37, y: 32 }, CAM2: { x: 37, y: 50 }, CAM3: { x: 37, y: 68 },
    LW: { x: 45, y: 12 }, CF_L: { x: 45, y: 32 }, CF: { x: 45, y: 50 }, CF_R: { x: 45, y: 68 }, ST: { x: 45, y: 50 }, RW: { x: 45, y: 88 },
    ST1: { x: 45, y: 32 }, ST2: { x: 45, y: 50 }, ST3: { x: 45, y: 68 },
};

interface PlayerCardProps {
    player: PlayerState;
    isHome: boolean;
    initialStamina?: number;
    gkRating?: number; // GK rating from TeamSnapshot
}

function PlayerCard({ player, isHome, initialStamina, gkRating }: PlayerCardProps) {
    const appearance = generateAppearance(player.playerId);
    
    // For GK, use gkRating instead of positionalContribution
    const isGK = player.position === 'GK';
    const performance = isGK 
        ? Math.round(gkRating || 0) 
        : Math.round((player.positionalContribution ?? 0) * (player.conditionMultiplier ?? 1));
    
    const currentStamina = player.stamina;
    const staminaPercent = initialStamina ? (currentStamina / initialStamina) * 100 : 100;
    const displayPosition = formatPositionName(player.position);

    const getStaminaColor = () => {
        if (staminaPercent >= 70) return 'bg-emerald-500';
        if (staminaPercent >= 40) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="flex flex-col items-center group cursor-pointer">
            <div className="relative w-14 h-14 rounded-full border-2 border-white shadow-lg flex items-center justify-center mb-1 transition-all group-hover:scale-110 group-hover:border-emerald-400 group-hover:ring-2 group-hover:ring-emerald-400/50 overflow-hidden"
                style={{ backgroundColor: isHome ? '#1e40af' : '#dc2626' }}>
                <div className="mt-2">
                    <MiniPlayer appearance={appearance} size={56} />
                </div>
            </div>

            <div className="relative mt-1 group/card">
                <div className="bg-gradient-to-br from-slate-900/95 via-emerald-950/90 to-slate-900/95 backdrop-blur-xl px-2.5 py-1.5 rounded-xl shadow-2xl border border-emerald-500/30 w-[100px] transform transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-emerald-500/50 hover:border-emerald-400/60">
                    <div className="text-[10px] font-bold text-white truncate text-center leading-tight tracking-wide">
                        {player.name}
                    </div>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent my-1"></div>
                    
                    <div className="flex items-center justify-between gap-1.5">
                        <div className="bg-emerald-600/30 backdrop-blur-sm px-1.5 py-0.5 rounded border border-emerald-400/40">
                            <span className="text-[8px] font-black text-emerald-300 tracking-wider">{displayPosition}</span>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-500/30 to-orange-500/30 backdrop-blur-sm px-1.5 py-0.5 rounded border border-yellow-400/50">
                            <span className="text-[9px] font-black text-yellow-300">{performance}</span>
                        </div>
                    </div>

                    <div className="mt-1.5 bg-slate-800/60 rounded-full h-1 overflow-hidden">
                        <div className={`h-full ${getStaminaColor()} transition-all`} style={{ width: `${staminaPercent}%` }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TacticalAnalysis({ homeSnapshot, awaySnapshot, homeTeamName, awayTeamName, initialStamina }: TacticalAnalysisProps) {
    const [viewMode, setViewMode] = useState<'formation' | 'tactical'>('formation');

    if (!homeSnapshot || !awaySnapshot) {
        return null;
    }

    const homeLanes = homeSnapshot.laneStrengths;
    const awayLanes = awaySnapshot.laneStrengths;
    const homePlayers = homeSnapshot.players || [];
    const awayPlayers = awaySnapshot.players || [];

    // Calculate win percentages for each zone
    const calculateWinPercentage = (homeValue: number, awayValue: number): { home: number; away: number; dominant: 'home' | 'away' | 'draw' } => {
        const total = homeValue + awayValue;
        if (total === 0) return { home: 50, away: 50, dominant: 'draw' };
        
        const homePercent = (homeValue / total) * 100;
        const awayPercent = (awayValue / total) * 100;
        const diff = homePercent - awayPercent;
        
        return {
            home: Math.round(homePercent),
            away: Math.round(awayPercent),
            dominant: Math.abs(diff) < 5 ? 'draw' : (homePercent > awayPercent ? 'home' : 'away')
        };
    };

    // Define zones: 3 phases (attack/possession/defense) × 3 lanes (left/center/right)
    const zones = [
        { phase: 'attack' as const, lane: 'left' as const, label: 'Attack Left', position: { row: 0, col: 0 } },
        { phase: 'attack' as const, lane: 'center' as const, label: 'Attack Center', position: { row: 0, col: 1 } },
        { phase: 'attack' as const, lane: 'right' as const, label: 'Attack Right', position: { row: 0, col: 2 } },
        { phase: 'possession' as const, lane: 'left' as const, label: 'Mid Left', position: { row: 1, col: 0 } },
        { phase: 'possession' as const, lane: 'center' as const, label: 'Mid Center', position: { row: 1, col: 1 } },
        { phase: 'possession' as const, lane: 'right' as const, label: 'Mid Right', position: { row: 1, col: 2 } },
        { phase: 'defense' as const, lane: 'left' as const, label: 'Defense Left', position: { row: 2, col: 0 } },
        { phase: 'defense' as const, lane: 'center' as const, label: 'Defense Center', position: { row: 2, col: 1 } },
        { phase: 'defense' as const, lane: 'right' as const, label: 'Defense Right', position: { row: 2, col: 2 } },
    ];

    // Filter starters
    const homeStarters = homePlayers.filter(p => !p.isSubstitute);
    const awayStarters = awayPlayers.filter(p => !p.isSubstitute);
    
    // Create position maps
    const homePositionMap: Record<string, PlayerState> = {};
    homeStarters.forEach(player => { homePositionMap[player.position] = player; });
    
    const awayPositionMap: Record<string, PlayerState> = {};
    awayStarters.forEach(player => { awayPositionMap[player.position] = player; });

    return (
        <div className="rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-white dark:bg-emerald-950/20 shadow-lg overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b-2 border-emerald-500/40 dark:border-emerald-500/30 bg-white/80 dark:bg-emerald-950/40 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                            <Target size={20} />
                            Match Analysis
                        </h3>
                        <p className="text-xs text-emerald-700 dark:text-emerald-500 mt-1">
                            {viewMode === 'formation' ? 'Player Formation & Performance' : '9-Zone Tactical Battle'}
                        </p>
                    </div>
                    
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('formation')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                viewMode === 'formation'
                                    ? 'bg-emerald-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-emerald-900/40 text-slate-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                            }`}
                        >
                            <Users size={16} />
                            Players
                        </button>
                        <button
                            onClick={() => setViewMode('tactical')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                viewMode === 'tactical'
                                    ? 'bg-emerald-600 text-white shadow-lg'
                                    : 'bg-white dark:bg-emerald-900/40 text-slate-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                            }`}
                        >
                            <Grid3x3 size={16} />
                            Tactical
                        </button>
                    </div>
                </div>
            </div>

            {viewMode === 'formation' ? (
                // Formation View - Player Pitch
                <div className="p-6">
                    <div className="relative w-full aspect-[16/7] rounded-xl border-4 border-white/30 shadow-2xl bg-gradient-to-br from-[#2d5016] via-[#3a6b1f] to-[#2d5016] dark:from-[#1a3d0f] dark:via-[#2d5016] dark:to-[#1a3d0f] overflow-hidden">
                        {/* Grass Pattern */}
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_4%,rgba(0,0,0,0.03)_4%,rgba(0,0,0,0.03)_8%)] pointer-events-none" />

                        {/* Pitch Markings */}
                        <div className="absolute inset-0 opacity-50 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[16%] h-[60%] border-2 border-white border-l-0" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[6%] h-[30%] border-2 border-white border-l-0" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[20%] bg-white" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[16%] h-[60%] border-2 border-white border-r-0" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[6%] h-[30%] border-2 border-white border-r-0" />
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
                                            initialStamina={initialStamina?.get(player.playerId)}
                                            gkRating={homeSnapshot.gkRating}
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
                                            initialStamina={initialStamina?.get(player.playerId)}
                                            gkRating={awaySnapshot.gkRating}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                // 3×3 Tactical Grid View - Overlaid on Pitch
                <div className="p-6">
                    {/* Team Labels */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-blue-500"></div>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{homeTeamName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-red-600 dark:text-red-400">{awayTeamName}</span>
                            <div className="w-4 h-4 rounded bg-red-500"></div>
                        </div>
                    </div>

                    {/* Pitch with 3×3 Grid Overlay */}
                    <div className="relative w-full aspect-[16/7] rounded-xl border-4 border-white/30 shadow-2xl bg-gradient-to-br from-[#2d5016] via-[#3a6b1f] to-[#2d5016] dark:from-[#1a3d0f] dark:via-[#2d5016] dark:to-[#1a3d0f] overflow-hidden">
                        {/* Grass Pattern */}
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_4%,rgba(0,0,0,0.03)_4%,rgba(0,0,0,0.03)_8%)] pointer-events-none" />

                        {/* Pitch Markings */}
                        <div className="absolute inset-0 opacity-50 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-white" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[16%] h-[60%] border-2 border-white border-l-0" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[6%] h-[30%] border-2 border-white border-l-0" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-[20%] bg-white" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[16%] h-[60%] border-2 border-white border-r-0" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[6%] h-[30%] border-2 border-white border-r-0" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-[20%] bg-white" />
                        </div>

                        {/* 3×3 Grid Overlay - Divide pitch into 9 zones */}
                        {/* Home side (left): Defense, Mid, Attack from left to right */}
                        {/* Lane positions: Left (top), Center (middle), Right (bottom) */}
                        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-2">
                            {/* Row 1: Left Lane (Top third of pitch) */}
                            {/* Home Defense Left */}
                            {(() => {
                                const homeValue = homeLanes.left.defense;
                                const awayValue = awayLanes.left.defense;
                                const result = calculateWinPercentage(homeValue, awayValue);
                                return (
                                    <div className="relative rounded-lg border-2 border-white/40 overflow-hidden backdrop-blur-sm transition-all hover:scale-105"
                                        style={{
                                            background: result.dominant === 'home' 
                                                ? `rgba(59, 130, 246, ${Math.min(result.home / 150, 0.7)})` 
                                                : result.dominant === 'away'
                                                ? `rgba(239, 68, 68, ${Math.min(result.away / 150, 0.7)})`
                                                : 'rgba(148, 163, 184, 0.3)'
                                        }}>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                            <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide mb-1">DEF LEFT</div>
                                            <div className={`text-xl sm:text-2xl font-black ${
                                                result.dominant === 'home' ? 'text-white' :
                                                result.dominant === 'away' ? 'text-white' : 'text-white/80'
                                            }`}>
                                                {result.dominant === 'home' ? result.home : result.dominant === 'away' ? result.away : 50}%
                                            </div>
                                            <div className="text-[8px] font-mono text-white/70 mt-1">
                                                {homeValue.toFixed(0)}:{awayValue.toFixed(0)}
                                            </div>
                                        </div>
                                        {result.dominant !== 'draw' && (
                                            <div className="absolute top-1 right-1 text-white">
                                                <TrendingUp size={12} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Home Mid Left */}
                            {(() => {
                                const homeValue = homeLanes.left.possession;
                                const awayValue = awayLanes.left.possession;
                                const result = calculateWinPercentage(homeValue, awayValue);
                                return (
                                    <div className="relative rounded-lg border-2 border-white/40 overflow-hidden backdrop-blur-sm transition-all hover:scale-105"
                                        style={{
                                            background: result.dominant === 'home' 
                                                ? `rgba(59, 130, 246, ${Math.min(result.home / 150, 0.7)})` 
                                                : result.dominant === 'away'
                                                ? `rgba(239, 68, 68, ${Math.min(result.away / 150, 0.7)})`
                                                : 'rgba(148, 163, 184, 0.3)'
                                        }}>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                            <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide mb-1">MID LEFT</div>
                                            <div className={`text-xl sm:text-2xl font-black ${
                                                result.dominant === 'home' ? 'text-white' :
                                                result.dominant === 'away' ? 'text-white' : 'text-white/80'
                                            }`}>
                                                {result.dominant === 'home' ? result.home : result.dominant === 'away' ? result.away : 50}%
                                            </div>
                                            <div className="text-[8px] font-mono text-white/70 mt-1">
                                                {homeValue.toFixed(0)}:{awayValue.toFixed(0)}
                                            </div>
                                        </div>
                                        {result.dominant !== 'draw' && (
                                            <div className="absolute top-1 right-1 text-white">
                                                <TrendingUp size={12} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Home Attack Left */}
                            {(() => {
                                const homeValue = homeLanes.left.attack;
                                const awayValue = awayLanes.left.attack;
                                const result = calculateWinPercentage(homeValue, awayValue);
                                return (
                                    <div className="relative rounded-lg border-2 border-white/40 overflow-hidden backdrop-blur-sm transition-all hover:scale-105"
                                        style={{
                                            background: result.dominant === 'home' 
                                                ? `rgba(59, 130, 246, ${Math.min(result.home / 150, 0.7)})` 
                                                : result.dominant === 'away'
                                                ? `rgba(239, 68, 68, ${Math.min(result.away / 150, 0.7)})`
                                                : 'rgba(148, 163, 184, 0.3)'
                                        }}>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                            <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide mb-1">ATK LEFT</div>
                                            <div className={`text-xl sm:text-2xl font-black ${
                                                result.dominant === 'home' ? 'text-white' :
                                                result.dominant === 'away' ? 'text-white' : 'text-white/80'
                                            }`}>
                                                {result.dominant === 'home' ? result.home : result.dominant === 'away' ? result.away : 50}%
                                            </div>
                                            <div className="text-[8px] font-mono text-white/70 mt-1">
                                                {homeValue.toFixed(0)}:{awayValue.toFixed(0)}
                                            </div>
                                        </div>
                                        {result.dominant !== 'draw' && (
                                            <div className="absolute top-1 right-1 text-white">
                                                <TrendingUp size={12} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Row 2: Center Lane */}
                            {(() => {
                                const homeValue = homeLanes.center.defense;
                                const awayValue = awayLanes.center.defense;
                                const result = calculateWinPercentage(homeValue, awayValue);
                                return (
                                    <div className="relative rounded-lg border-2 border-white/40 overflow-hidden backdrop-blur-sm transition-all hover:scale-105"
                                        style={{
                                            background: result.dominant === 'home' 
                                                ? `rgba(59, 130, 246, ${Math.min(result.home / 150, 0.7)})` 
                                                : result.dominant === 'away'
                                                ? `rgba(239, 68, 68, ${Math.min(result.away / 150, 0.7)})`
                                                : 'rgba(148, 163, 184, 0.3)'
                                        }}>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                            <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide mb-1">DEF CTR</div>
                                            <div className={`text-xl sm:text-2xl font-black ${
                                                result.dominant === 'home' ? 'text-white' :
                                                result.dominant === 'away' ? 'text-white' : 'text-white/80'
                                            }`}>
                                                {result.dominant === 'home' ? result.home : result.dominant === 'away' ? result.away : 50}%
                                            </div>
                                            <div className="text-[8px] font-mono text-white/70 mt-1">
                                                {homeValue.toFixed(0)}:{awayValue.toFixed(0)}
                                            </div>
                                        </div>
                                        {result.dominant !== 'draw' && (
                                            <div className="absolute top-1 right-1 text-white">
                                                <TrendingUp size={12} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {(() => {
                                const homeValue = homeLanes.center.possession;
                                const awayValue = awayLanes.center.possession;
                                const result = calculateWinPercentage(homeValue, awayValue);
                                return (
                                    <div className="relative rounded-lg border-2 border-white/40 overflow-hidden backdrop-blur-sm transition-all hover:scale-105"
                                        style={{
                                            background: result.dominant === 'home' 
                                                ? `rgba(59, 130, 246, ${Math.min(result.home / 150, 0.7)})` 
                                                : result.dominant === 'away'
                                                ? `rgba(239, 68, 68, ${Math.min(result.away / 150, 0.7)})`
                                                : 'rgba(148, 163, 184, 0.3)'
                                        }}>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                            <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide mb-1">MID CTR</div>
                                            <div className={`text-xl sm:text-2xl font-black ${
                                                result.dominant === 'home' ? 'text-white' :
                                                result.dominant === 'away' ? 'text-white' : 'text-white/80'
                                            }`}>
                                                {result.dominant === 'home' ? result.home : result.dominant === 'away' ? result.away : 50}%
                                            </div>
                                            <div className="text-[8px] font-mono text-white/70 mt-1">
                                                {homeValue.toFixed(0)}:{awayValue.toFixed(0)}
                                            </div>
                                        </div>
                                        {result.dominant !== 'draw' && (
                                            <div className="absolute top-1 right-1 text-white">
                                                <TrendingUp size={12} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {(() => {
                                const homeValue = homeLanes.center.attack;
                                const awayValue = awayLanes.center.attack;
                                const result = calculateWinPercentage(homeValue, awayValue);
                                return (
                                    <div className="relative rounded-lg border-2 border-white/40 overflow-hidden backdrop-blur-sm transition-all hover:scale-105"
                                        style={{
                                            background: result.dominant === 'home' 
                                                ? `rgba(59, 130, 246, ${Math.min(result.home / 150, 0.7)})` 
                                                : result.dominant === 'away'
                                                ? `rgba(239, 68, 68, ${Math.min(result.away / 150, 0.7)})`
                                                : 'rgba(148, 163, 184, 0.3)'
                                        }}>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                            <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide mb-1">ATK CTR</div>
                                            <div className={`text-xl sm:text-2xl font-black ${
                                                result.dominant === 'home' ? 'text-white' :
                                                result.dominant === 'away' ? 'text-white' : 'text-white/80'
                                            }`}>
                                                {result.dominant === 'home' ? result.home : result.dominant === 'away' ? result.away : 50}%
                                            </div>
                                            <div className="text-[8px] font-mono text-white/70 mt-1">
                                                {homeValue.toFixed(0)}:{awayValue.toFixed(0)}
                                            </div>
                                        </div>
                                        {result.dominant !== 'draw' && (
                                            <div className="absolute top-1 right-1 text-white">
                                                <TrendingUp size={12} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Row 3: Right Lane */}
                            {(() => {
                                const homeValue = homeLanes.right.defense;
                                const awayValue = awayLanes.right.defense;
                                const result = calculateWinPercentage(homeValue, awayValue);
                                return (
                                    <div className="relative rounded-lg border-2 border-white/40 overflow-hidden backdrop-blur-sm transition-all hover:scale-105"
                                        style={{
                                            background: result.dominant === 'home' 
                                                ? `rgba(59, 130, 246, ${Math.min(result.home / 150, 0.7)})` 
                                                : result.dominant === 'away'
                                                ? `rgba(239, 68, 68, ${Math.min(result.away / 150, 0.7)})`
                                                : 'rgba(148, 163, 184, 0.3)'
                                        }}>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                            <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide mb-1">DEF RIGHT</div>
                                            <div className={`text-xl sm:text-2xl font-black ${
                                                result.dominant === 'home' ? 'text-white' :
                                                result.dominant === 'away' ? 'text-white' : 'text-white/80'
                                            }`}>
                                                {result.dominant === 'home' ? result.home : result.dominant === 'away' ? result.away : 50}%
                                            </div>
                                            <div className="text-[8px] font-mono text-white/70 mt-1">
                                                {homeValue.toFixed(0)}:{awayValue.toFixed(0)}
                                            </div>
                                        </div>
                                        {result.dominant !== 'draw' && (
                                            <div className="absolute top-1 right-1 text-white">
                                                <TrendingUp size={12} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {(() => {
                                const homeValue = homeLanes.right.possession;
                                const awayValue = awayLanes.right.possession;
                                const result = calculateWinPercentage(homeValue, awayValue);
                                return (
                                    <div className="relative rounded-lg border-2 border-white/40 overflow-hidden backdrop-blur-sm transition-all hover:scale-105"
                                        style={{
                                            background: result.dominant === 'home' 
                                                ? `rgba(59, 130, 246, ${Math.min(result.home / 150, 0.7)})` 
                                                : result.dominant === 'away'
                                                ? `rgba(239, 68, 68, ${Math.min(result.away / 150, 0.7)})`
                                                : 'rgba(148, 163, 184, 0.3)'
                                        }}>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                            <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide mb-1">MID RIGHT</div>
                                            <div className={`text-xl sm:text-2xl font-black ${
                                                result.dominant === 'home' ? 'text-white' :
                                                result.dominant === 'away' ? 'text-white' : 'text-white/80'
                                            }`}>
                                                {result.dominant === 'home' ? result.home : result.dominant === 'away' ? result.away : 50}%
                                            </div>
                                            <div className="text-[8px] font-mono text-white/70 mt-1">
                                                {homeValue.toFixed(0)}:{awayValue.toFixed(0)}
                                            </div>
                                        </div>
                                        {result.dominant !== 'draw' && (
                                            <div className="absolute top-1 right-1 text-white">
                                                <TrendingUp size={12} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {(() => {
                                const homeValue = homeLanes.right.attack;
                                const awayValue = awayLanes.right.attack;
                                const result = calculateWinPercentage(homeValue, awayValue);
                                return (
                                    <div className="relative rounded-lg border-2 border-white/40 overflow-hidden backdrop-blur-sm transition-all hover:scale-105"
                                        style={{
                                            background: result.dominant === 'home' 
                                                ? `rgba(59, 130, 246, ${Math.min(result.home / 150, 0.7)})` 
                                                : result.dominant === 'away'
                                                ? `rgba(239, 68, 68, ${Math.min(result.away / 150, 0.7)})`
                                                : 'rgba(148, 163, 184, 0.3)'
                                        }}>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                                            <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide mb-1">ATK RIGHT</div>
                                            <div className={`text-xl sm:text-2xl font-black ${
                                                result.dominant === 'home' ? 'text-white' :
                                                result.dominant === 'away' ? 'text-white' : 'text-white/80'
                                            }`}>
                                                {result.dominant === 'home' ? result.home : result.dominant === 'away' ? result.away : 50}%
                                            </div>
                                            <div className="text-[8px] font-mono text-white/70 mt-1">
                                                {homeValue.toFixed(0)}:{awayValue.toFixed(0)}
                                            </div>
                                        </div>
                                        {result.dominant !== 'draw' && (
                                            <div className="absolute top-1 right-1 text-white">
                                                <TrendingUp size={12} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex items-center justify-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <Shield size={14} className="text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-400">Defense</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Target size={14} className="text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-400">Possession</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Swords size={14} className="text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-400">Attack</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
