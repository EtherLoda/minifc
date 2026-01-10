import React, { Suspense } from 'react';
import { api } from '@/lib/api';
import { TacticsContent } from './TacticsContent';
import { Skeleton } from '@/components/ui/SkeletonLoader';

function TacticsLoadingSkeleton() {
    return (
        <div className="min-h-screen font-mono">
            <div className="relative z-10 container mx-auto px-4 py-8">
                <Skeleton className="h-4 w-32 mb-6" />
                <Skeleton className="h-32 w-full mb-8 rounded-2xl" />
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
                    <Skeleton className="h-[600px] rounded-2xl" />
                    <Skeleton className="h-[600px] rounded-2xl" />
                </div>
            </div>
        </div>
    );
}

async function TacticsData({ id, teamId }: { id: string; teamId: string }) {
    const match = await api.getMatch(id);
    const players = await api.getPlayers(teamId);

    let tactics = null;
    try {
        const tacticsData = await api.getTactics(id);
        tactics = match.homeTeamId === teamId ? tacticsData.homeTactics : tacticsData.awayTactics;
    } catch (e) {
        // No tactics yet
    }

    return (
        <TacticsContent
            match={match}
            teamId={teamId}
            players={players.data}
            tactics={tactics}
        />
    );
}

export default async function TacticsPage({ params }: { params: Promise<{ id: string; teamId: string }> }) {
    const { id, teamId } = await params;

    return (
        <Suspense fallback={<TacticsLoadingSkeleton />}>
            <TacticsData id={id} teamId={teamId} />
        </Suspense>
    );
}
