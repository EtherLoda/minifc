'use client';

interface SkillBarsProps {
    currentSkills?: any;
    potentialSkills?: any;
    isGoalkeeper?: boolean;
}

export function SkillBars({ currentSkills, potentialSkills, isGoalkeeper }: SkillBarsProps) {
    // Get all skills as array for display
    const getAllSkills = () => {
        const skills: Array<{ category: string; name: string; current: number; potential: number; label: string }> = [];
        
        if (currentSkills) {
            // Physical skills
            if (currentSkills.physical) {
                Object.entries(currentSkills.physical).forEach(([key, value]) => {
                    const potential = potentialSkills?.physical?.[key] || (value as number);
                    skills.push({
                        category: 'physical',
                        name: key,
                        current: Math.floor(value as number),
                        potential: Math.floor(potential),
                        label: key.charAt(0).toUpperCase() + key.slice(1)
                    });
                });
            }
            
            // Technical skills
            if (currentSkills.technical) {
                Object.entries(currentSkills.technical).forEach(([key, value]) => {
                    const potential = potentialSkills?.technical?.[key] || (value as number);
                    skills.push({
                        category: 'technical',
                        name: key,
                        current: Math.floor(value as number),
                        potential: Math.floor(potential),
                        label: key.charAt(0).toUpperCase() + key.slice(1)
                    });
                });
            }
            
            // Mental skills
            if (currentSkills.mental) {
                Object.entries(currentSkills.mental).forEach(([key, value]) => {
                    const potential = potentialSkills?.mental?.[key] || (value as number);
                    skills.push({
                        category: 'mental',
                        name: key,
                        current: Math.floor(value as number),
                        potential: Math.floor(potential),
                        label: key.charAt(0).toUpperCase() + key.slice(1)
                    });
                });
            }
        }
        
        return skills;
    };

    const colorClasses = {
        physical: {
            bg: 'bg-emerald-500/10 dark:bg-emerald-500/5',
            border: 'border-emerald-500/30 dark:border-emerald-500/20',
            text: 'text-emerald-600 dark:text-emerald-400',
            bar: 'bg-emerald-500',
            barLight: 'bg-emerald-400'
        },
        technical: {
            bg: 'bg-blue-500/10 dark:bg-blue-500/5',
            border: 'border-blue-500/30 dark:border-blue-500/20',
            text: 'text-blue-600 dark:text-blue-400',
            bar: 'bg-blue-500',
            barLight: 'bg-blue-400'
        },
        mental: {
            bg: 'bg-purple-500/10 dark:bg-purple-500/5',
            border: 'border-purple-500/30 dark:border-purple-500/20',
            text: 'text-purple-600 dark:text-purple-400',
            bar: 'bg-purple-500',
            barLight: 'bg-purple-400'
        }
    };

    const skills = getAllSkills();

    if (skills.length === 0) {
        return null;
    }

    return (
        <div className="space-y-2.5">
            {/* Group skills by category */}
            {['physical', 'technical', 'mental'].map(category => {
                const categorySkills = skills.filter(s => s.category === category);
                if (categorySkills.length === 0) return null;
                
                const colors = colorClasses[category as keyof typeof colorClasses];
                
                return (
                    <div key={category} className={`rounded-lg border ${colors.bg} ${colors.border} p-2`}>
                        <div className={`text-xs font-black uppercase tracking-wider mb-2 ${colors.text}`}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {categorySkills.map(skill => (
                                <div key={skill.name} className="flex-1 min-w-[90px]">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase truncate">
                                            {skill.label}
                                        </span>
                                        <span className="text-[9px] font-black text-slate-700 dark:text-slate-300 tabular-nums shrink-0">
                                            {skill.current}/{skill.potential}
                                        </span>
                                    </div>
                                    {/* Skill rectangles - multiple rounded rectangles (tall and thin) */}
                                    <div className="flex items-center gap-1 flex-wrap">
                                        {/* Solid rectangles for current value */}
                                        {Array.from({ length: skill.current }).map((_, i) => (
                                            <div
                                                key={`solid-${i}`}
                                                className={`h-5 w-2 rounded-md ${colors.bar} shadow-md transition-all hover:scale-110 relative overflow-hidden group`}
                                                style={{
                                                    boxShadow: `0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)`,
                                                }}
                                            >
                                                {/* Shine effect */}
                                                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-md pointer-events-none" />
                                            </div>
                                        ))}
                                        {/* Transparent rectangles for potential beyond current */}
                                        {Array.from({ length: Math.max(0, skill.potential - skill.current) }).map((_, i) => (
                                            <div
                                                key={`potential-${i}`}
                                                className={`h-5 w-2 rounded-md ${colors.bar} opacity-30 transition-all hover:opacity-50 hover:scale-110 relative`}
                                                style={{
                                                    boxShadow: `0 1px 2px rgba(0,0,0,0.1)`,
                                                }}
                                            >
                                                {/* Subtle inner highlight */}
                                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-md pointer-events-none" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

