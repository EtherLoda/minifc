'use client';

import { use } from 'react';
import { api } from '@/lib/api';
import { TeamBenchConfig } from '@/components/team/TeamBenchConfig';
import { useAuth } from '@/components/auth/AuthContext';

export function TeamBenchConfigWrapper({ teamId }: { teamId: string }) {
    const { user } = useAuth();
    const team = use(api.getTeam(teamId));

    // Check if current user owns this team
    const isOwnTeam = user?.id === team.userId;

    if (!isOwnTeam) {
        return null;
    }

    return <TeamBenchConfig teamId={teamId} isOwnTeam={isOwnTeam} />;
}
