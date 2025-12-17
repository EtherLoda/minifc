'use client';

import { useState, useEffect, useCallback } from 'react';
import { api, MatchEventsResponse } from '@/lib/api';

export function useMatchSimulation(matchId: string, initialData?: MatchEventsResponse) {
    const [data, setData] = useState<MatchEventsResponse | null>(initialData || null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Poll for updates when simulation is active
    useEffect(() => {
        if (!isSimulating) return;

        const interval = setInterval(async () => {
            try {
                const eventsData = await api.getMatchEvents(matchId);
                setData(eventsData);

                // Stop polling if match is completed
                if (eventsData.isComplete) {
                    setIsSimulating(false);
                }
            } catch (err) {
                console.error('Error fetching match events:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch events');
            }
        }, 2000); // Poll every 2 seconds

        return () => clearInterval(interval);
    }, [isSimulating, matchId]);

    const startSimulation = useCallback(async () => {
        try {
            setError(null);
            await api.triggerSimulation(matchId);
            setIsSimulating(true);
        } catch (err) {
            console.error('Error triggering simulation:', err);
            setError(err instanceof Error ? err.message : 'Failed to trigger simulation');
            setIsSimulating(false);
        }
    }, [matchId]);

    const stopPolling = useCallback(() => {
        setIsSimulating(false);
    }, []);

    return {
        data,
        isSimulating,
        error,
        startSimulation,
        stopPolling,
    };
}
