"use client";

import React from 'react';

export function Background() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            {/* Grid Floor */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#022c22_1px,transparent_1px),linear-gradient(to_bottom,#022c22_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 dark:opacity-50 transition-colors duration-500"></div>

            {/* Glowing Center Circle (Pitch) */}
            <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] rounded-full blur-[100px] animate-pulse transition-colors duration-700 bg-emerald-500/5 border-emerald-500/5 dark:border-emerald-500/20 dark:bg-emerald-900/10"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] transition-colors duration-700 bg-emerald-500/5 border-emerald-500/5 dark:border-emerald-500/20 dark:bg-emerald-900/10"></div>
        </div>
    );
}
