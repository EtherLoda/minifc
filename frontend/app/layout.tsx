import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Background } from '../components/layout/Background';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth/AuthContext';
import AppShell from '@/components/layout/AppShell';

import { NotificationProvider } from '@/components/ui/NotificationContext';
import { NotificationContainer } from '@/components/ui/NotificationContainer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GoalXI - Football Manager',
  description: 'Next-gen football management simulation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-emerald-400 font-mono antialiased selection:bg-emerald-500 selection:text-white dark:selection:text-black transition-colors duration-300`}>
        <AuthProvider>
          <NotificationProvider>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
              <Background />
              <div className="relative z-10">
                <AppShell>
                  {children}
                </AppShell>
              </div>
              <NotificationContainer />
            </ThemeProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
