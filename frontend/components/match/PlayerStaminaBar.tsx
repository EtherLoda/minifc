'use client';

interface PlayerStaminaBarProps {
    stamina: number;
    maxStamina?: number;
    showLabel?: boolean;
}

export function PlayerStaminaBar({ stamina, maxStamina = 5, showLabel = true }: PlayerStaminaBarProps) {
    const percentage = Math.min((stamina / maxStamina) * 100, 100);

    // Color coding based on stamina level
    const getColor = () => {
        if (stamina > 3.5) return 'bg-emerald-500';
        if (stamina > 2) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getTextColor = () => {
        if (stamina > 3.5) return 'text-emerald-600 dark:text-emerald-400';
        if (stamina > 2) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="w-full">
            {showLabel && (
                <div className={`text-xs font-medium mb-1 ${getTextColor()}`}>
                    Stamina: {stamina.toFixed(1)}/{maxStamina}
                </div>
            )}
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full ${getColor()} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
