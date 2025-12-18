'use client';

import React, { useEffect, useState } from 'react';
import {
    CheckCircle2,
    AlertCircle,
    AlertTriangle,
    Info,
    X
} from 'lucide-react';
import { clsx } from 'clsx';
import { Notification, NotificationType } from './NotificationContext';

const icons: Record<NotificationType, React.ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
};

const borderColors: Record<NotificationType, string> = {
    success: 'border-emerald-500/50 dark:border-emerald-500/30',
    error: 'border-rose-500/50 dark:border-rose-500/30',
    warning: 'border-amber-500/50 dark:border-amber-500/30',
    info: 'border-blue-500/50 dark:border-blue-500/30',
};

const bgColors: Record<NotificationType, string> = {
    success: 'bg-emerald-500/5',
    error: 'bg-rose-500/5',
    warning: 'bg-amber-500/5',
    info: 'bg-blue-500/5',
};

export function NotificationItem({
    notification,
    onDismiss
}: {
    notification: Notification;
    onDismiss: (id: string) => void;
}) {
    const [isExiting, setIsExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        if (notification.duration === 0) return;

        const duration = notification.duration || 5000;
        const intervalTime = 10;
        const step = (intervalTime / duration) * 100;

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - step;
            });
        }, intervalTime);

        return () => clearInterval(interval);
    }, [notification.duration]);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => onDismiss(notification.id), 300);
    };

    return (
        <div
            className={clsx(
                "group relative overflow-hidden w-80 mb-3 transition-all duration-300 ease-out transform",
                isExiting ? "translate-x-full opacity-0 scale-95" : "translate-x-0 opacity-100 scale-100",
                "backdrop-blur-xl border-l-4 shadow-2xl rounded-xl",
                "bg-white/80 dark:bg-slate-900/90",
                borderColors[notification.type],
                bgColors[notification.type]
            )}
        >
            <div className="p-4 flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    {icons[notification.type]}
                </div>
                <div className="flex-1 min-w-0">
                    {notification.title && (
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
                            {notification.title}
                        </h4>
                    )}
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                        {notification.message}
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {notification.duration !== 0 && (
                <div className="absolute bottom-0 left-0 h-1 bg-slate-200 dark:bg-slate-800 w-full">
                    <div
                        className={clsx(
                            "h-full transition-all duration-100 linear",
                            {
                                'bg-emerald-500': notification.type === 'success',
                                'bg-rose-500': notification.type === 'error',
                                'bg-amber-500': notification.type === 'warning',
                                'bg-blue-500': notification.type === 'info',
                            }
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
