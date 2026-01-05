import { Goal, Users, Clock, Pause, Square } from 'lucide-react';
import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { MatchEvent } from '@/lib/api';
import styles from './MatchComponents.module.css';

interface MatchTimelineProps {
    events: MatchEvent[];
    totalMinutes: number;
    currentMinute: number;
    onTimeSelect: (minute: number) => void;
}

export function MatchTimeline({ events, totalMinutes, currentMinute, onTimeSelect }: MatchTimelineProps) {
    const [selectedMinute, setSelectedMinute] = useState(currentMinute);
    const [isDragging, setIsDragging] = useState(false);

    // Calculate injury times dynamically without spoiling future data
    const periodCalculations = useMemo(() => {
        // Safe string comparison helper
        const isType = (e: any, target: string) => {
            const typeValue = typeof e?.type === 'string' ? e.type.toUpperCase() : '';
            const typeNameValue = typeof e?.typeName === 'string' ? e.typeName.toUpperCase() : '';
            return typeValue === target || typeNameValue === target;
        };

        // Find markers
        const halfTimeEvent = events.find(e => isType(e, 'HALF_TIME'));
        const secondHalfEvent = events.find(e => isType(e, 'SECOND_HALF'));
        const fullTimeEvent = events.find(e => isType(e, 'FULL_TIME'));

        const hasStarted2H = !!secondHalfEvent || currentMinute >= 46;

        // 1st Half logic
        let firstHalfEnd = 45;
        if (halfTimeEvent) {
            firstHalfEnd = Math.max(45, halfTimeEvent.minute);
        } else if (currentMinute > 45 && !hasStarted2H) {
            firstHalfEnd = currentMinute;
        } else if (hasStarted2H) {
            // If 2nd half started, 1H must have ended. Find the last 1H event or assume 45.
            const last1HEvent = [...events].reverse().find(e => e.minute < 46);
            firstHalfEnd = Math.max(45, last1HEvent?.minute || 45);
        }

        // 2nd Half logic
        let secondHalfEnd = 90;
        if (fullTimeEvent) {
            secondHalfEnd = Math.max(90, fullTimeEvent.minute);
        } else if (currentMinute > 90) {
            secondHalfEnd = currentMinute;
        } else if (totalMinutes > 90 && currentMinute >= 90) {
            secondHalfEnd = currentMinute;
        }

        return {
            h1End: firstHalfEnd,
            h1Injury: firstHalfEnd > 45 ? firstHalfEnd - 45 : 0,
            h2End: secondHalfEnd,
            h2Injury: secondHalfEnd > 90 ? secondHalfEnd - 90 : 0,
            is1HFinished: !!halfTimeEvent || hasStarted2H,
            is2HFinished: !!fullTimeEvent
        };
    }, [events, currentMinute, totalMinutes]);

    // Define periods structure
    const periods = useMemo(() => {
        const p = [
            {
                id: '1st',
                name: '1st Half',
                start: 0,
                end: periodCalculations.h1End,
                standard: 45,
                injury: periodCalculations.h1Injury,
                isFinished: periodCalculations.is1HFinished
            },
            {
                id: '2nd',
                name: '2nd Half',
                start: 46,
                end: periodCalculations.h2End,
                standard: 90,
                injury: periodCalculations.h2Injury,
                isFinished: periodCalculations.is2HFinished
            },
        ];

        if (totalMinutes > 100 && (currentMinute > 95 || periodCalculations.is2HFinished)) {
            p.push({
                id: 'et1',
                name: 'ET 1st',
                start: 90,
                end: 105,
                standard: 105,
                injury: 0,
                isFinished: currentMinute > 105
            });
        }
        if (totalMinutes > 110 && (currentMinute > 105)) {
            p.push({
                id: 'et2',
                name: 'ET 2nd',
                start: 105,
                end: 120,
                standard: 120,
                injury: 0,
                isFinished: currentMinute >= 120
            });
        }
        return p;
    }, [periodCalculations, totalMinutes, currentMinute]);

    useEffect(() => {
        if (!isDragging) {
            setSelectedMinute(currentMinute);
        }
    }, [currentMinute, isDragging]);

    const timelineEvents = useMemo(() => {
        return events.filter(event => {
            const typeStr = typeof event.type === 'string' ? event.type.toUpperCase() : '';
            const typeNameStr = typeof event.typeName === 'string' ? event.typeName.toUpperCase() : '';
            return (typeStr === 'GOAL' || typeNameStr === 'GOAL' ||
                typeStr === 'SUBSTITUTION' || typeNameStr === 'SUBSTITUTION' ||
                typeStr === 'YELLOW_CARD' || typeNameStr === 'YELLOW_CARD' ||
                typeStr === 'RED_CARD' || typeNameStr === 'RED_CARD') &&
                (typeStr !== 'SNAPSHOT' && typeNameStr !== 'SNAPSHOT');
        });
    }, [events]);

    const handleInteraction = (e: React.MouseEvent | React.TouchEvent, periodStart: number, periodEnd: number, element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const periodDuration = periodEnd - periodStart;
        const minute = periodStart + Math.round(percentage * periodDuration);

        const restrictedMinute = Math.min(minute, currentMinute);
        setSelectedMinute(restrictedMinute);
        onTimeSelect(restrictedMinute);
    };

    const isMinuteInPeriod = (min: number, period: any) => {
        if (period.id === '1st') return min < 46;
        if (period.id === '2nd') return min >= 46 && min <= 90;
        if (period.id === 'et1') return min > 90 && min <= 105;
        if (period.id === 'et2') return min > 105;
        return false;
    };

    const getEventIcon = (event: MatchEvent) => {
        const typeStr = typeof event.type === 'string' ? event.type.toUpperCase() : '';
        const typeNameStr = typeof event.typeName === 'string' ? event.typeName.toUpperCase() : '';
        if (typeStr === 'GOAL' || typeNameStr === 'GOAL') return <Goal className="w-2.5 h-2.5" />;
        if (typeStr === 'SUBSTITUTION' || typeNameStr === 'SUBSTITUTION') return <Users className="w-2.5 h-2.5" />;
        if (typeStr === 'YELLOW_CARD' || typeNameStr === 'YELLOW_CARD' ||
            typeStr === 'RED_CARD' || typeNameStr === 'RED_CARD') return <Square className="w-2.5 h-2.5 fill-current" />;
        return <Clock className="w-2.5 h-2.5" />;
    };

    const getEventColor = (event: MatchEvent) => {
        const typeStr = typeof event.type === 'string' ? event.type.toUpperCase() : '';
        const typeNameStr = typeof event.typeName === 'string' ? event.typeName.toUpperCase() : '';
        if (typeStr === 'GOAL' || typeNameStr === 'GOAL') return styles.eventGoal;
        if (typeStr === 'SUBSTITUTION' || typeNameStr === 'SUBSTITUTION') return styles.eventSub;
        if (typeStr === 'YELLOW_CARD' || typeNameStr === 'YELLOW_CARD') return styles.eventYellow;
        if (typeStr === 'RED_CARD' || typeNameStr === 'RED_CARD') return styles.eventRed;
        return 'bg-slate-500 border-slate-400';
    };

    const formatDisplayTime = (min: number) => {
        if (min > 90) return `90+${min - 90}`;
        if (min > 45 && min <= 50) return `45+${min - 45}`;
        return `${min}`;
    };

    return (
        <div className={styles.timelineWrapper}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">Match Timeline</h3>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    <span className="tabular-nums">{formatDisplayTime(selectedMinute)}'</span>
                    {!periodCalculations.is2HFinished && <span className="mx-1 text-emerald-500/50 animate-pulse">●</span>}
                    {periodCalculations.is2HFinished && <span className="ml-1 text-slate-400">/ {totalMinutes}'</span>}
                </div>
            </div>

            <div className="flex gap-2 h-16 sm:h-20 mb-2">
                {periods.map((period) => {
                    const isPeriodActive = currentMinute >= period.start;
                    const periodDuration = period.end - period.start;
                    const progressInPeriod = isPeriodActive
                        ? Math.min(1, (selectedMinute - period.start) / Math.max(1, periodDuration))
                        : 0;
                    const currentProgress = isPeriodActive
                        ? Math.min(1, (currentMinute - period.start) / Math.max(1, periodDuration))
                        : 0;

                    const showInjury = period.injury > 0 && (currentMinute >= period.standard || period.isFinished);

                    return (
                        <div key={period.id} className="flex-1 flex flex-col gap-2 h-full">
                            <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase text-center tracking-tighter flex items-center justify-center gap-1">
                                {period.name}
                                {showInjury && (
                                    <span className={styles.stoppageLabel}>
                                        +{period.injury}'
                                    </span>
                                )}
                            </div>

                            <div
                                className={`relative flex-1 rounded-lg border-2 border-dashed transition-all cursor-pointer overflow-visible
                                    ${isPeriodActive
                                        ? 'bg-slate-100 dark:bg-slate-800/50 border-emerald-500/20 shadow-inner'
                                        : 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed'}`}
                                onMouseDown={(e) => {
                                    if (!isPeriodActive) return;
                                    setIsDragging(true);
                                    handleInteraction(e, period.start, period.end, e.currentTarget);
                                }}
                                onMouseMove={(e) => {
                                    if (isDragging && isPeriodActive) {
                                        handleInteraction(e, period.start, period.end, e.currentTarget);
                                    }
                                }}
                                onMouseUp={() => setIsDragging(false)}
                                onTouchStart={(e) => {
                                    if (!isPeriodActive) return;
                                    setIsDragging(true);
                                    handleInteraction(e, period.start, period.end, e.currentTarget);
                                }}
                                onTouchMove={(e) => {
                                    if (isDragging && isPeriodActive) {
                                        handleInteraction(e, period.start, period.end, e.currentTarget);
                                    }
                                }}
                                onTouchEnd={() => setIsDragging(false)}
                                onClick={(e) => {
                                    if (isPeriodActive) {
                                        handleInteraction(e, period.start, period.end, e.currentTarget);
                                    }
                                }}
                            >
                                {isPeriodActive && currentProgress > 0 && (
                                    <div
                                        className={styles.timelineProgress}
                                        style={{ width: `${currentProgress * 100}%` }}
                                    />
                                )}

                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-1 mb-1 overflow-hidden">
                                    {isPeriodActive && (
                                        <div
                                            className="h-full bg-emerald-500 transition-all duration-150 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                                            style={{ width: `${progressInPeriod * 100}%` }}
                                        />
                                    )}
                                </div>

                                {timelineEvents
                                    .filter(e => {
                                        if (period.id === '1st') return e.minute < 46;
                                        if (period.id === '2nd') return e.minute >= 46 && e.minute <= (totalMinutes > 100 ? 90 : totalMinutes);
                                        return e.minute >= period.start && e.minute < period.end;
                                    })
                                    .map((event, idx) => {
                                        const pos = ((event.minute - period.start) / Math.max(1, periodDuration)) * 100;
                                        return (
                                            <button
                                                key={`${event.id}-${idx}`}
                                                className={`${styles.eventButton} ${getEventColor(event)}`}
                                                style={{ left: `${pos}%` }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (event.minute <= currentMinute) {
                                                        setSelectedMinute(event.minute);
                                                        onTimeSelect(event.minute);
                                                    }
                                                }}
                                                title={`${formatDisplayTime(event.minute)}' - ${event.description || event.typeName || event.type}`}
                                            >
                                                {getEventIcon(event)}
                                            </button>
                                        );
                                    })}

                                {selectedMinute >= period.start && selectedMinute <= period.end && isMinuteInPeriod(selectedMinute, period) && (
                                    <div
                                        className={styles.currentIndicator}
                                        style={{ left: `${progressInPeriod * 100}%` }}
                                    >
                                        <div className={styles.indicatorCore}></div>
                                        {currentMinute === selectedMinute && (
                                            <div className={styles.indicatorPing}></div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between px-1 text-[8px] font-mono font-bold text-slate-400">
                                <span>{period.start}'</span>
                                <span>{showInjury ? `${period.standard}+${period.injury}` : period.standard}'</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center justify-center gap-4 sm:gap-8 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_4px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-semibold text-slate-500">Goal</span>
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_4px_rgba(59,130,246,0.5)]"></div>
                    <span className="text-[10px] font-semibold text-slate-500">Sub</span>
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <div className="w-2 h-2 bg-yellow-500 rounded-sm shadow-[0_0_4px_rgba(234,179,8,0.5)]"></div>
                    <span className="text-[10px] font-semibold text-slate-500">Yellow</span>
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <div className="w-2 h-2 bg-red-500 rounded-sm shadow-[0_0_4px_rgba(239,68,68,0.5)]"></div>
                    <span className="text-[10px] font-semibold text-slate-500">Red</span>
                </div>
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <div className="w-2 h-2 bg-emerald-500/30 border border-emerald-500/40 rounded-sm"></div>
                    <span className="text-[10px] font-semibold text-slate-500">Live Time</span>
                </div>
            </div>
        </div>
    );
}
