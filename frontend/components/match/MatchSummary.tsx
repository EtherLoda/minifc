'use client';

import React from 'react';
import { TeamSnapshot } from '@/lib/api';

interface MatchSummaryProps {
    homeTeamName: string;
    awayTeamName: string;
    homeSnapshot: TeamSnapshot | null;
    awaySnapshot: TeamSnapshot | null;
    homeShots?: number;
    awayShots?: number;
    homeGoals?: number;
    awayGoals?: number;
}

interface SectorRowProps {
    label: string;
    homeValue: number;
    awayValue: number;
    homeTeamName: string;
    awayTeamName: string;
    homeColor?: string;
    awayColor?: string;
}

const SectorRow: React.FC<SectorRowProps> = ({
    label,
    homeValue,
    awayValue,
    homeTeamName,
    awayTeamName,
    homeColor = 'bg-[#6ECDEA]',
    awayColor = 'bg-[#D15E5E]'
}) => {
    const total = homeValue + awayValue;
    const homePercent = total === 0 ? 50 : (homeValue / total) * 100;
    const awayPercent = total === 0 ? 50 : (awayValue / total) * 100;

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
                <div className="text-right flex-1">
                    <span className="text-sm font-bold text-slate-900 dark:text-white mr-2">
                        {homeValue.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        {homePercent.toFixed(0)}%
                    </span>
                </div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider px-4 min-w-[180px] text-center">
                    {label}
                </div>
                <div className="text-left flex-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">
                        {awayPercent.toFixed(0)}%
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {awayValue.toFixed(1)}
                    </span>
                </div>
            </div>
            <div className="flex h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div
                    className={`${homeColor} transition-all duration-500 flex items-center justify-end pr-1`}
                    style={{ width: `${homePercent}%` }}
                    title={`${homeTeamName}: ${homeValue.toFixed(1)}`}
                >
                    {homePercent > 15 && (
                        <span className="text-[9px] font-bold text-white opacity-80">
                            {homePercent.toFixed(0)}%
                        </span>
                    )}
                </div>
                <div
                    className={`${awayColor} transition-all duration-500 flex items-center justify-start pl-1`}
                    style={{ width: `${awayPercent}%` }}
                    title={`${awayTeamName}: ${awayValue.toFixed(1)}`}
                >
                    {awayPercent > 15 && (
                        <span className="text-[9px] font-bold text-white opacity-80">
                            {awayPercent.toFixed(0)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export function MatchSummary({
    homeTeamName,
    awayTeamName,
    homeSnapshot,
    awaySnapshot,
    homeShots = 0,
    awayShots = 0,
    homeGoals = 0,
    awayGoals = 0
}: MatchSummaryProps) {
    if (!homeSnapshot || !awaySnapshot) {
        return (
            <div className="rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-white dark:bg-emerald-950/20 shadow-lg p-6">
                <div className="text-center text-slate-500 dark:text-slate-400">
                    Loading match data...
                </div>
            </div>
        );
    }

    const homeLanes = homeSnapshot.laneStrengths;
    const awayLanes = awaySnapshot.laneStrengths;
    const homeGK = homeSnapshot.gkRating || 0;
    const awayGK = awaySnapshot.gkRating || 0;

    return (
        <div className="rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-white dark:bg-emerald-950/20 shadow-lg overflow-hidden">
            <div className="p-5 border-b-2 border-emerald-500/40 dark:border-emerald-500/30 bg-gradient-to-r from-blue-50 via-white to-red-50 dark:from-blue-950/40 dark:via-emerald-950/40 dark:to-red-950/40">
                <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold uppercase tracking-wider" style={{ color: '#6ECDEA' }}>
                        {homeTeamName}
                    </h3>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                        Match Summary
                    </h3>
                    <h3 className="text-base font-bold uppercase tracking-wider" style={{ color: '#D15E5E' }}>
                        {awayTeamName}
                    </h3>
                </div>
            </div>

            <div className="p-6 space-y-6">
                {/* Goalkeeper Rating */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 text-center">
                        Goalkeeper Rating
                    </h4>
                    <SectorRow
                        label="GK Rating"
                        homeValue={homeGK}
                        awayValue={awayGK}
                        homeTeamName={homeTeamName}
                        awayTeamName={awayTeamName}
                    />
                </div>

                {/* Defense Sectors */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 text-center">
                        Defensive Strength
                    </h4>
                    <SectorRow
                        label="Left Defense"
                        homeValue={homeLanes.left.defense}
                        awayValue={awayLanes.left.defense}
                        homeTeamName={homeTeamName}
                        awayTeamName={awayTeamName}
                    />
                    <SectorRow
                        label="Center Defense"
                        homeValue={homeLanes.center.defense}
                        awayValue={awayLanes.center.defense}
                        homeTeamName={homeTeamName}
                        awayTeamName={awayTeamName}
                    />
                    <SectorRow
                        label="Right Defense"
                        homeValue={homeLanes.right.defense}
                        awayValue={awayLanes.right.defense}
                        homeTeamName={homeTeamName}
                        awayTeamName={awayTeamName}
                    />
                </div>

                {/* Possession / Midfield */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 text-center">
                        Midfield Control
                    </h4>
                    <SectorRow
                        label="Left Midfield"
                        homeValue={homeLanes.left.possession}
                        awayValue={awayLanes.left.possession}
                        homeTeamName={homeTeamName}
                        awayTeamName={awayTeamName}
                    />
                    <SectorRow
                        label="Center Midfield"
                        homeValue={homeLanes.center.possession}
                        awayValue={awayLanes.center.possession}
                        homeTeamName={homeTeamName}
                        awayTeamName={awayTeamName}
                    />
                    <SectorRow
                        label="Right Midfield"
                        homeValue={homeLanes.right.possession}
                        awayValue={awayLanes.right.possession}
                        homeTeamName={homeTeamName}
                        awayTeamName={awayTeamName}
                    />
                </div>

                {/* Attack Sectors */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 text-center">
                        Attacking Power
                    </h4>
                    <SectorRow
                        label="Left Attack"
                        homeValue={homeLanes.left.attack}
                        awayValue={awayLanes.left.attack}
                        homeTeamName={homeTeamName}
                        awayTeamName={awayTeamName}
                    />
                    <SectorRow
                        label="Center Attack"
                        homeValue={homeLanes.center.attack}
                        awayValue={awayLanes.center.attack}
                        homeTeamName={homeTeamName}
                        awayTeamName={awayTeamName}
                    />
                    <SectorRow
                        label="Right Attack"
                        homeValue={homeLanes.right.attack}
                        awayValue={awayLanes.right.attack}
                        homeTeamName={homeTeamName}
                        awayTeamName={awayTeamName}
                    />
                </div>

                {/* Chance Distribution */}
                {(homeShots > 0 || awayShots > 0) && (
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3 text-center">
                            Chance Distribution
                        </h4>
                        <SectorRow
                            label="Total Shots"
                            homeValue={homeShots}
                            awayValue={awayShots}
                            homeTeamName={homeTeamName}
                            awayTeamName={awayTeamName}
                            homeColor="bg-emerald-500"
                            awayColor="bg-emerald-500"
                        />
                        <SectorRow
                            label="Goal"
                            homeValue={homeGoals}
                            awayValue={awayGoals}
                            homeTeamName={homeTeamName}
                            awayTeamName={awayTeamName}
                            homeColor="bg-amber-500"
                            awayColor="bg-amber-500"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
