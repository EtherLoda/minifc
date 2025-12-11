import React from 'react';

interface AbilityStarsProps {
    currentSkills: any;
    isGoalkeeper?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

// Calculate overall rating from skills
const calculateOverallRating = (skills: any, isGoalkeeper: boolean = false): number => {
    if (!skills) return 0;

    let total = 0;
    let count = 0;

    // For goalkeepers, prioritize GK skills
    if (isGoalkeeper && skills.technical) {
        const gkSkills = ['handling', 'reflexes', 'positioning'];
        gkSkills.forEach(skill => {
            if (skills.technical[skill] !== undefined) {
                total += skills.technical[skill];
                count++;
            }
        });
    }

    // Add all skills
    Object.values(skills).forEach((category: any) => {
        if (typeof category === 'object') {
            Object.values(category).forEach((value: any) => {
                if (typeof value === 'number') {
                    total += value;
                    count++;
                }
            });
        }
    });

    return count > 0 ? total / count : 0;
};

// Convert rating to stars (0-5)
const ratingToStars = (rating: number): number => {
    // Rating is 0-20, convert to 0-5 stars
    // 0-4: 1 star, 4-8: 2 stars, 8-12: 3 stars, 12-16: 4 stars, 16-20: 5 stars
    if (rating < 4) return 1;
    if (rating < 8) return 2;
    if (rating < 12) return 3;
    if (rating < 16) return 4;
    return 5;
};

export const AbilityStars: React.FC<AbilityStarsProps> = ({
    currentSkills,
    isGoalkeeper = false,
    size = 'md'
}) => {
    const rating = calculateOverallRating(currentSkills, isGoalkeeper);
    const stars = ratingToStars(rating);

    const sizeClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-lg',
    };

    // Color based on stars
    const getStarColor = (index: number) => {
        if (index < stars) {
            if (stars === 5) return 'text-amber-400';   // Legend (Gold)
            if (stars === 4) return 'text-purple-400';  // Elite (Purple)
            if (stars === 3) return 'text-emerald-400'; // Good (Emerald)
            if (stars === 2) return 'text-blue-400';    // Average (Blue)
            return 'text-slate-500';                    // Poor (Slate)
        }
        return 'text-slate-800';
    };

    return (
        <div className={`flex gap-0.5 ${sizeClasses[size]}`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className={`${getStarColor(i)} transition-all`}
                    style={{
                        filter: i < stars ? 'drop-shadow(0 0 2px currentColor)' : 'none'
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
};
