'use client';

import { useAuth } from '@/components/auth/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
    const { isLoggedIn } = useAuth();
    const pathname = usePathname();

    // If logged in, show Sidebar + Dashboard Layout
    // Unless we are explicitly in a "public" route? (Dashboard usually covers everything for logged in user)

    if (isLoggedIn) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 ml-64 p-6 transition-all duration-300">
                    <div className="container mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        );
    }

    // Default Guest Layout
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    );
}
