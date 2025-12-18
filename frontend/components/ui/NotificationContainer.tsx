'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { useNotification } from './NotificationContext';
import { NotificationItem } from './NotificationItem';

export function NotificationContainer() {
    const { notifications, dismissNotification } = useNotification();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
            <div className="flex flex-col items-end pointer-events-auto">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onDismiss={dismissNotification}
                    />
                ))}
            </div>
        </div>,
        document.body
    );
}
