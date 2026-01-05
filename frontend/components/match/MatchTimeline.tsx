'use client';

import { useState, useRef, useEffect } from 'react';
import { MatchEvent } from '@/lib/api';
import { Goal, Users, Clock } from 'lucide-react';

interface MatchTimelineProps {
    events: MatchEvent[];
    totalMinutes: number;
    currentMinute: number;
    onTimeSelect: (minute: number) => void;
}

export function MatchTimeline({ events, totalMinutes, currentMinute, onTimeSelect }: MatchTimelineProps) {
    const [selectedMinute, setSelectedMinute] = useState(currentMinute);
    const [isDragging, setIsDragging] = useState(false);
    const timelineRef = useRef<HTMLDivElement>(null);

    // Update selected minute when current minute changes (during live match)
    useEffect(() => {
        if (!isDragging) {
            setSelectedMinute(currentMinute);
        }
    }, [currentMinute, isDragging]);

    // Extract important events (goals, substitutions) for timeline markers
    // Filter out snapshot events - they are only used internally for player state
    const timelineEvents = events.filter(event => {
        const type = typeof event.type === 'string' ? event.type.toUpperCase() : '';
        const typeName = typeof event.typeName === 'string' ? event.typeName.toUpperCase() : '';
        // Only show goals and substitutions on timeline
        return (type === 'GOAL' || typeName === 'GOAL' || 
                type === 'SUBSTITUTION' || typeName === 'SUBSTITUTION') &&
               (type !== 'SNAPSHOT' && typeName !== 'SNAPSHOT');
    });

    // Handle timeline click/drag
    const handleTimelineInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const minute = Math.round(percentage * totalMinutes);

        setSelectedMinute(minute);
        onTimeSelect(minute);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        handleTimelineInteraction(e);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            handleTimelineInteraction(e);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Handle event marker click - don't stop propagation, let timeline handle it naturally
    const handleEventClick = (event: MatchEvent, e: React.MouseEvent) => {
        // Don't stop propagation - allow timeline to handle the click
        // But set the minute to the exact event time for precision
        setSelectedMinute(event.minute);
        onTimeSelect(event.minute);
    };

    // Get event icon
    const getEventIcon = (event: MatchEvent) => {
        const type = typeof event.type === 'string' ? event.type.toUpperCase() : '';
        const typeName = typeof event.typeName === 'string' ? event.typeName.toUpperCase() : '';
        
        if (type === 'GOAL' || typeName === 'GOAL') {
            return <Goal className="w-3 h-3" />;
        }
        if (type === 'SUBSTITUTION' || typeName === 'SUBSTITUTION') {
            return <Users className="w-3 h-3" />;
        }
        return <Clock className="w-3 h-3" />;
    };

    // Get event color
    const getEventColor = (event: MatchEvent) => {
        const type = typeof event.type === 'string' ? event.type.toUpperCase() : '';
        const typeName = typeof event.typeName === 'string' ? event.typeName.toUpperCase() : '';
        
        if (type === 'GOAL' || typeName === 'GOAL') {
            return 'bg-green-500 border-green-400 hover:bg-green-600';
        }
        if (type === 'SUBSTITUTION' || typeName === 'SUBSTITUTION') {
            return 'bg-blue-500 border-blue-400 hover:bg-blue-600';
        }
        return 'bg-slate-500 border-slate-400 hover:bg-slate-600';
    };

    return (
        <div className="w-full p-6 rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-white dark:bg-emerald-950/20 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">
                        Match Timeline
                    </h3>
                </div>
                <div className="text-sm font-bold text-emerald-700 dark:text-emerald-500">
                    {selectedMinute}' / {totalMinutes}'
                </div>
            </div>

            {/* Timeline Container */}
            <div className="relative">
                {/* Timeline Track */}
                <div
                    ref={timelineRef}
                    className="relative h-12 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer overflow-visible"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={handleTimelineInteraction}
                >
                    {/* Progress Bar - pointer-events-none allows clicks to pass through */}
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-150 pointer-events-none"
                        style={{ width: `${(selectedMinute / totalMinutes) * 100}%` }}
                    />

                    {/* Event Markers */}
                    {timelineEvents.map((event, index) => {
                        const position = (event.minute / totalMinutes) * 100;
                        return (
                            <button
                                key={`${event.id}-${index}`}
                                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 ${getEventColor(event)} text-white shadow-lg z-10 flex items-center justify-center transition-all hover:scale-125`}
                                style={{ left: `${position}%` }}
                                onClick={(e) => handleEventClick(event, e)}
                                title={`${event.minute}' - ${event.typeName || event.type}`}
                            >
                                {getEventIcon(event)}
                            </button>
                        );
                    })}

                    {/* Current Position Indicator */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 z-20 pointer-events-none"
                        style={{ left: `${(selectedMinute / totalMinutes) * 100}%` }}
                    >
                        <div className="absolute inset-0 bg-white dark:bg-emerald-300 rounded-full border-4 border-emerald-600 dark:border-emerald-500 shadow-xl"></div>
                        <div className="absolute inset-0 bg-emerald-600 dark:bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                </div>

                {/* Time Markers */}
                <div className="flex justify-between mt-2 px-1">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">0'</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">45'</span>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">90'</span>
                    {totalMinutes > 90 && (
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{totalMinutes}'</span>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Goal className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">Goal</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300">Substitution</span>
                </div>
            </div>
        </div>
    );
}
