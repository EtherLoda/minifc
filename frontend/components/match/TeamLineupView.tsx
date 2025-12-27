'use client';

import { PlayerState } from '@/lib/api';
import { PlayerPerformanceCard } from './PlayerPerformanceCard';

interface TeamLineupViewProps {
    teamName: string;
    players: PlayerState[];
    formation?: string;
}

export function TeamLineupView({ teamName, players, formation = '4-4-2' }: TeamLineupViewProps) {
    // Group players by position type for display
    const groupPlayersByLine = () => {
        const gk = players.filter(p => p.position === 'GK');
        const defenders = players.filter(p => ['LB', 'LCB', 'RCB', 'RB', 'CB'].includes(p.position));
        const midfielders = players.filter(p => ['LM', 'LCM', 'CM', 'RCM', 'RM', 'CDM', 'CAM'].includes(p.position));
        const forwards = players.filter(p => ['LW', 'ST', 'RW', 'CF'].includes(p.position));

        return { gk, defenders, midfielders, forwards };
    };

    const { gk, defenders, midfielders, forwards } = groupPlayersByLine();

    const renderLine = (linePlayers: PlayerState[], label: string) => {
        if (linePlayers.length === 0) return null;

        return (
            <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 text-center">
                    {label}
                </div>
                <div className={`grid gap-2 ${linePlayers.length === 1 ? 'grid-cols-1' :
                        linePlayers.length === 2 ? 'grid-cols-2' :
                            linePlayers.length === 3 ? 'grid-cols-3' :
                                'grid-cols-4'
                    }`}>
                    {linePlayers.map(player => (
                        <PlayerPerformanceCard
                            key={player.playerId}
                            player={player}
                            compact
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-b from-emerald-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="mb-4 text-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{teamName}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Formation: {formation}</p>
            </div>

            <div className="space-y-2">
                {renderLine(forwards, 'Forwards')}
                {renderLine(midfielders, 'Midfielders')}
                {renderLine(defenders, 'Defenders')}
                {renderLine(gk, 'Goalkeeper')}
            </div>

            {players.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No lineup data available
                </div>
            )}
        </div>
    );
}
