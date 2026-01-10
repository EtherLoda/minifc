'use client';

import React, { use } from 'react';
import { api } from '@/lib/api';
import { BenchConfigEditor } from '@/components/team/BenchConfig';
import { BenchConfig } from '@/types/team';

interface TeamBenchConfigProps {
    teamId: string;
    isOwnTeam: boolean;
}

export function TeamBenchConfig({ teamId, isOwnTeam }: TeamBenchConfigProps) {
    const team = use(api.getTeam(teamId));
    const playersRes = use(api.getPlayers(teamId));
    const players = playersRes.data;

    return (
        <div className="mb-4">
            <BenchConfigEditor
                teamId={teamId}
                players={players}
                initialConfig={(team as any).benchConfig as BenchConfig | null}
                isOwnTeam={isOwnTeam}
            />
        </div>
    );
}
